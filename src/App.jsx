import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { DataProvider } from '@/contexts/DataContext.jsx';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';
import Layout from '@/components/Layout.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import HomePage from '@/pages/HomePage.jsx';
import ClientDashboardPage from '@/pages/ClientDashboardPage.jsx';
import AdminDashboardPage from '@/pages/AdminDashboardPage.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from './firebase'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from "firebase/firestore";

function App() {
  useEffect(() => {
    const testFirestore = async () => {
      const querySnapshot = await getDocs(collection(db, "test"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      });
    };
    testFirestore();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DataProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route 
                    path="/client/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['client']}>
                        <ClientDashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </Layout>
          </Router>
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;