
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
    import { Users, Briefcase, CheckSquare } from 'lucide-react';
    import AdminClientsTab from '@/components/admin/AdminClientsTab.jsx';
    import AdminPlansTab from '@/components/admin/AdminPlansTab.jsx';
    import AdminPaymentsTab from '@/components/admin/AdminPaymentsTab.jsx';
    import { useTheme } from '@/contexts/ThemeContext.jsx';


    const AdminDashboardPage = () => {
      const [currentTab, setCurrentTab] = useState("clients");
      const { theme } = useTheme();
      
      const cardClass = theme === 'dark' ? 'glassmorphism border-slate-700' : 'bg-white shadow-lg border-gray-200';
      const textPrimaryClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
      const textSecondaryClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
      const tabsListClass = theme === 'dark' ? 'bg-slate-800/60' : 'bg-gray-100';
      const tabsTriggerClass = theme === 'dark' ? 'text-gray-300 data-[state=active]:text-white' : 'text-gray-600 data-[state=active]:text-gray-900';


      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${cardClass} min-h-[calc(100vh-200px)]`}>
            <CardHeader>
              <CardTitle className={`text-3xl ${textPrimaryClass}`}>Panel de Administración</CardTitle>
              <CardDescription className={textSecondaryClass}>Gestiona clientes, planes de financiamiento y pagos.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className={`grid w-full grid-cols-3 ${tabsListClass}`}>
                  <TabsTrigger value="clients" className={`${tabsTriggerClass} data-[state=active]:bg-blue-600`}><Users className="mr-2 h-4 w-4" />Clientes</TabsTrigger>
                  <TabsTrigger value="plans" className={`${tabsTriggerClass} data-[state=active]:bg-purple-600`}><Briefcase className="mr-2 h-4 w-4" />Planes</TabsTrigger>
                  <TabsTrigger value="payments" className={`${tabsTriggerClass} data-[state=active]:bg-green-600`}><CheckSquare className="mr-2 h-4 w-4" />Validar Pagos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="clients" className="mt-6">
                  <AdminClientsTab />
                </TabsContent>

                <TabsContent value="plans" className="mt-6">
                  <AdminPlansTab />
                </TabsContent>

                <TabsContent value="payments" className="mt-6">
                   <AdminPaymentsTab />
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AdminDashboardPage;
  