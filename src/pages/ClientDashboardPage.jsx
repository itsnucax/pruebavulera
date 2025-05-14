
    import React, { useState, useEffect } from 'react';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useData } from '@/contexts/DataContext.jsx';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Progress } from '@/components/ui/progress.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { motion } from 'framer-motion';
    import { FileUp, DollarSign, Percent, CalendarDays, CheckCircle, Clock, UserCog } from 'lucide-react';
    import { useTheme } from '@/contexts/ThemeContext.jsx';

    const ClientDashboardPage = () => {
      const { currentUser } = useAuth();
      const { getClientById, getPlanById, addPayment, clients, updateClient } = useData();
      const { toast } = useToast();
      const { theme } = useTheme();

      const [clientData, setClientData] = useState(null);
      const [planData, setPlanData] = useState(null);
      const [progress, setProgress] = useState(0);
      const [voucherFile, setVoucherFile] = useState(null);
      const [paymentAmount, setPaymentAmount] = useState('');
      const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
      const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
      const [profileFormData, setProfileFormData] = useState({
        name: '',
        clientId: '',
        phone: '',
        address: '',
        firstPaymentDate: '',
      });


      useEffect(() => {
        if (currentUser && currentUser.type === 'client') {
          const currentClient = clients.find(c => c.id === currentUser.id);
          if (currentClient) {
            setClientData(currentClient);
            setProfileFormData({
              name: currentClient.name || '',
              clientId: currentClient.clientId || '',
              phone: currentClient.phone || '',
              address: currentClient.address || '',
              firstPaymentDate: currentClient.firstPaymentDate || '',
            });
            if (currentClient.assignedPlanId) {
              const currentPlan = getPlanById(currentClient.assignedPlanId);
              setPlanData(currentPlan);
              if (currentPlan && currentClient.payments) {
                const validatedPayments = currentClient.payments.filter(p => p.validated).length;
                const calculatedProgress = (validatedPayments / currentPlan.totalInstallments) * 100;
                setProgress(Math.min(calculatedProgress, 100));
              }
            }
          }
        }
      }, [currentUser, clients, getPlanById]);

      const handleFileChange = (event) => {
        setVoucherFile(event.target.files[0]);
      };

      const handleUploadPayment = (e) => {
        e.preventDefault();
        if (!voucherFile || !paymentAmount) {
          toast({ variant: "destructive", title: "Error", description: "Por favor, ingresa el monto y selecciona un archivo." });
          return;
        }
        const paymentData = {
          date: new Date().toISOString().split('T')[0],
          amount: parseFloat(paymentAmount),
          voucherUrl: voucherFile.name, 
          validated: false,
        };
        addPayment(clientData.id, paymentData);
        toast({ title: "Comprobante Subido", description: "Tu comprobante ha sido enviado para validación." });
        setVoucherFile(null);
        setPaymentAmount('');
        setIsUploadModalOpen(false);
      };

      const handleProfileFormChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData(prev => ({ ...prev, [name]: value }));
      };
    
      const handleProfileUpdate = (e) => {
        e.preventDefault();
        const updatedData = { ...clientData, ...profileFormData };
        updateClient(updatedData);
        toast({ title: "Perfil Actualizado", description: "Tus datos han sido actualizados correctamente." });
        setIsEditProfileModalOpen(false);
      };

      if (!clientData || !planData) {
        return <div className="text-center py-10">Cargando datos del cliente...</div>;
      }
      
      const balance = (planData.totalInstallments * planData.installmentAmount) - clientData.payments.filter(p => p.validated).reduce((sum, p) => sum + p.amount, 0);
      
      const cardClass = theme === 'dark' ? 'glassmorphism border-slate-700' : 'bg-white shadow-lg border-gray-200';
      const textPrimaryClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
      const textSecondaryClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
      const inputClass = theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500';
      const buttonPrimaryClass = theme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold' : 'bg-blue-600 hover:bg-blue-700 text-white font-semibold';
      const buttonOutlineClass = theme === 'dark' ? 'text-gray-300 border-slate-600 hover:bg-slate-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100';


      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <Card className={cardClass}>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className={`text-3xl ${textPrimaryClass}`}>Bienvenido, {clientData.name}</CardTitle>
                <CardDescription className={textSecondaryClass}>Este es el resumen de tu plan de financiamiento.</CardDescription>
              </div>
              <Dialog open={isEditProfileModalOpen} onOpenChange={setIsEditProfileModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className={`${theme === 'dark' ? 'text-gray-300 border-slate-600 hover:bg-slate-700/50 hover:text-white' : 'text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900'}`}>
                    <UserCog className="mr-2 h-4 w-4" /> Editar Perfil
                  </Button>
                </DialogTrigger>
                <DialogContent className={`sm:max-w-md ${cardClass}`}>
                  <DialogHeader>
                    <DialogTitle className={textPrimaryClass}>Editar Perfil</DialogTitle>
                    <DialogDescription className={textSecondaryClass}>Actualiza tus datos personales.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="space-y-4 pt-2">
                    <div><Label htmlFor="profileName" className={textSecondaryClass}>Nombre Completo</Label><Input id="profileName" name="name" value={profileFormData.name} onChange={handleProfileFormChange} required className={inputClass}/></div>
                    <div><Label htmlFor="profileClientId" className={textSecondaryClass}>ID de Cliente</Label><Input id="profileClientId" name="clientId" value={profileFormData.clientId} disabled className={`${inputClass} ${theme === 'dark' ? 'bg-slate-800/50 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}/></div>
                    <div><Label htmlFor="profilePhone" className={textSecondaryClass}>Número Celular</Label><Input id="profilePhone" name="phone" type="tel" value={profileFormData.phone} onChange={handleProfileFormChange} required className={inputClass}/></div>
                    <div><Label htmlFor="profileAddress" className={textSecondaryClass}>Dirección</Label><Input id="profileAddress" name="address" value={profileFormData.address} onChange={handleProfileFormChange} required className={inputClass}/></div>
                    <div><Label htmlFor="profileFirstPaymentDate" className={textSecondaryClass}>Fecha de Primer Pago</Label><Input id="profileFirstPaymentDate" name="firstPaymentDate" type="date" value={profileFormData.firstPaymentDate} onChange={handleProfileFormChange} required className={inputClass}/></div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsEditProfileModalOpen(false)} className={buttonOutlineClass}>Cancelar</Button>
                      <Button type="submit" className={buttonPrimaryClass}>Guardar Cambios</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Plan: {planData.name}</h3>
                <p className={textSecondaryClass}>{planData.description}</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <Card className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50 border'} p-4 rounded-lg`}>
                  <DollarSign className={`h-8 w-8 mx-auto mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <p className={`text-sm ${textSecondaryClass}`}>Monto por Cuota</p>
                  <p className={`text-2xl font-bold ${textPrimaryClass}`}>${planData.installmentAmount.toFixed(2)}</p>
                </Card>
                <Card className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50 border'} p-4 rounded-lg`}>
                  <Percent className={`h-8 w-8 mx-auto mb-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <p className={`text-sm ${textSecondaryClass}`}>Total de Cuotas</p>
                  <p className={`text-2xl font-bold ${textPrimaryClass}`}>{planData.totalInstallments}</p>
                </Card>
                <Card className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50 border'} p-4 rounded-lg`}>
                  <CalendarDays className={`h-8 w-8 mx-auto mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                  <p className={`text-sm ${textSecondaryClass}`}>Frecuencia</p>
                  <p className={`text-2xl font-bold ${textPrimaryClass} capitalize`}>{planData.frequency}</p>
                </Card>
              </div>

              <div>
                <h4 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Progreso de Financiamiento: {progress.toFixed(0)}%</h4>
                <Progress value={progress} className={`w-full h-6 ${theme === 'dark' ? '[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-teal-400' : '[&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-teal-500 bg-gray-200'}`} />
                <p className={`text-sm mt-1 ${textSecondaryClass}`}>Saldo pendiente: <span className={`font-semibold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>${balance.toFixed(2)}</span></p>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button className={buttonPrimaryClass}>
                    <FileUp className="mr-2 h-5 w-5" /> Subir Comprobante de Pago
                  </Button>
                </DialogTrigger>
                <DialogContent className={`sm:max-w-[480px] ${cardClass}`}>
                  <DialogHeader>
                    <DialogTitle className={textPrimaryClass}>Subir Comprobante</DialogTitle>
                    <DialogDescription className={textSecondaryClass}>
                      Sube tu comprobante de pago para que sea validado por un administrador.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUploadPayment} className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="paymentAmount" className={textSecondaryClass}>Monto del Pago</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Ej: 100.00"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label htmlFor="voucher" className={textSecondaryClass}>Archivo del Comprobante (PDF, JPG, PNG)</Label>
                      <Input
                        id="voucher"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                        className={`${inputClass} ${theme === 'dark' ? 'file:text-gray-400 file:bg-slate-800 file:border-0 file:hover:bg-slate-700' : 'file:text-gray-500 file:bg-gray-100 file:border-0 file:hover:bg-gray-200'}`}
                      />
                      {voucherFile && <p className={`text-xs mt-1 ${textSecondaryClass}`}>Archivo seleccionado: {voucherFile.name}</p>}
                    </div>
                    <DialogFooter>
                       <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)} className={buttonOutlineClass}>Cancelar</Button>
                       <Button type="submit" className={buttonPrimaryClass}>Enviar Comprobante</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className={`text-2xl ${textPrimaryClass}`}>Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              {clientData.payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className={`${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-200 hover:bg-gray-50/50'}`}>
                      <TableHead className={textSecondaryClass}>Fecha</TableHead>
                      <TableHead className={textSecondaryClass}>Monto</TableHead>
                      <TableHead className={textSecondaryClass}>Comprobante</TableHead>
                      <TableHead className={textSecondaryClass}>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientData.payments.sort((a,b) => new Date(b.date) - new Date(a.date)).map((payment) => (
                      <TableRow key={payment.id} className={`${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-200 hover:bg-gray-50/50'}`}>
                        <TableCell className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>{payment.voucherUrl}</TableCell>
                        <TableCell>
                          {payment.validated ? (
                            <span className={`flex items-center ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}><CheckCircle className="mr-1 h-4 w-4" /> Validado</span>
                          ) : (
                            <span className={`flex items-center ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}><Clock className="mr-1 h-4 w-4" /> Pendiente</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className={`${textSecondaryClass} text-center py-4`}>No hay pagos registrados aún.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ClientDashboardPage;
  