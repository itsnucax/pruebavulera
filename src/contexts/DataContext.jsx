import React, { createContext, useContext } from 'react';
import { useFirestore } from '@/hooks/useFirestore.jsx'; // Reemplazamos useLocalStorage

export const DataContext = createContext(null);

const initialClients = [
  { id: '1', clientId: 'cliente1', password: 'password123', name: 'Juan Pérez', assignedPlanId: 'plan1', phone: '555-1234', payments: [{id: 'p1', date: '2025-04-15', amount: 100, voucherUrl: 'comprobante1.pdf', validated: true}, {id: 'p2', date: '2025-05-15', amount: 100, voucherUrl: 'comprobante2.pdf', validated: false}], address: '', firstPaymentDate: '' },
  { id: '2', clientId: 'cliente2', password: 'password456', name: 'Ana Gómez', assignedPlanId: 'plan2', phone: '555-5678', payments: [], address: '', firstPaymentDate: '' },
];

const initialPlans = [
  { id: 'plan1', name: 'Plan iPhone 15 Básico', totalInstallments: 12, installmentAmount: 100, frequency: 'mensual', description: 'Financiamiento básico para iPhone 15' },
  { id: 'plan2', name: 'Plan iPhone 15 Pro Max Premium', totalInstallments: 24, installmentAmount: 150, frequency: 'mensual', description: 'Financiamiento premium para iPhone 15 Pro Max' },
];

export const DataProvider = ({ children }) => {
  const [clients, setClients, loadingClients] = useFirestore('easyphone_clients', initialClients);
  const [plans, setPlans, loadingPlans] = useFirestore('easyphone_plans', initialPlans);

  const addClient = (client) => {
  console.log('Client data before adding:', client);

  const cleanClient = {};
  Object.keys(client).forEach(key => {
    if (typeof client[key] !== 'function') {
      cleanClient[key] = client[key];
    }
  });

  setClients(prev => [...prev, { ...cleanClient, id: Date.now().toString(), payments: [], address: cleanClient.address || '', firstPaymentDate: cleanClient.firstPaymentDate || '' }]);
};

  const updateClient = (updatedClient) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };
  
  const getClientById = (clientId) => {
    return clients.find(c => c.id === clientId);
  };

  const addPlan = (plan) => {
    setPlans(prev => [...prev, { ...plan, id: Date.now().toString() }]);
  };

  const updatePlan = (updatedPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const getPlanById = (planId) => {
    return plans.find(p => p.id === planId);
  };

  const addPayment = (clientId, payment) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, payments: [...client.payments, { ...payment, id: Date.now().toString(), validated: false }] }
        : client
    ));
  };

  const validatePayment = (clientId, paymentId) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          payments: client.payments.map(p => p.id === paymentId ? { ...p, validated: true } : p)
        };
      }
      return client;
    }));
  };
  
  const updatePayment = (clientId, updatedPayment) => {
    setClients(prevClients => prevClients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          payments: client.payments.map(payment => 
            payment.id === updatedPayment.id ? updatedPayment : payment
          )
        };
      }
      return client;
    }));
  };

  return (
    <DataContext.Provider value={{ clients, setClients, addClient, updateClient, getClientById, plans, setPlans, addPlan, updatePlan, getPlanById, addPayment, validatePayment, updatePayment, loading: loadingClients || loadingPlans }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);