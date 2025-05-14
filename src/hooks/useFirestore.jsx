import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function useFirestore(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Fetching data for key: ${key}`);
    const fetchData = async () => {
      try {
        const docRef = doc(db, "appData", key);
        console.log(`Document reference created for ${key}:`, docRef.path);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log(`Data found for ${key}:`, docSnap.data().value);
          setValue(docSnap.data().value);
        } else {
          console.log(`No data found for ${key}, setting initial value:`, initialValue);
          await setDoc(docRef, { value: initialValue });
          setValue(initialValue);
        }
      } catch (error) {
        console.error(`Error fetching ${key} from Firestore:`, error);
        setValue(initialValue);
      } finally {
        console.log(`Loading complete for ${key}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [key, initialValue]);

  const setFirestoreValue = async (newValueOrFn) => {
    try {
      // Si newValueOrFn es una función, la ejecutamos para obtener el nuevo valor
      const newValue = typeof newValueOrFn === 'function' ? newValueOrFn(value) : newValueOrFn;

      console.log(`Setting new value for ${key}:`, newValue);
      setValue(newValue);
      const docRef = doc(db, "appData", key);
      await setDoc(docRef, { value: newValue });
      console.log(`Value set successfully for ${key}`);
    } catch (error) {
      console.error(`Error setting ${key} in Firestore:`, error);
    }
  };

  return [value, setFirestoreValue, loading];
}