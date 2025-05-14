import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/useFirestore.jsx'; // Reemplazamos useLocalStorage
import { DataContext } from '@/contexts/DataContext.jsx';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser, loadingUser] = useFirestore('easyphone_currentUser', null); // Usamos useFirestore
  const { clients } = useContext(DataContext); 
  const [error, setError] = useState('');

  const loginClient = (clientId, password) => {
    setError('');
    const client = clients.find(c => c.clientId === clientId && c.password === password);
    if (client) {
      setCurrentUser({ type: 'client', id: client.id, clientId: client.clientId });
      return true;
    }
    setError('ID de cliente o contraseña incorrectos.');
    return false;
  };

  const loginAdmin = (password) => {
    setError('');
    if (password === 'MUN2025') {
      setCurrentUser({ type: 'admin' });
      return true;
    }
    setError('Contraseña de administrador incorrecta.');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  useEffect(() => {
    // No es necesario este efecto ya que useFirestore maneja la carga inicial
    // Pero lo dejamos como fallback por si hay problemas con la sincronización
    if (!currentUser && !loadingUser) {
      setCurrentUser(null); // Asegura que sea null si no hay datos válidos
    }
  }, [currentUser, loadingUser]);

  return (
    <AuthContext.Provider value={{ currentUser, loginClient, loginAdmin, logout, error, setError, loading: loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);