
    import React, { useState, useEffect } from 'react';
    import { useData } from '@/contexts/DataContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';
    import { Edit3, Eye } from 'lucide-react';

    const PaymentValidationTab = () => {
      const { clients: allClients, validatePayment, updatePayment, loading: dataLoading, fetchData } = useData();
      const { toast } = useToast();

      const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
      const [selectedClientForPayments, setSelectedClientForPayments] = useState(null);
      const [selectedPaymentToEdit, setSelectedPaymentToEdit] = useState(null);
      const [paymentEditFormData, setPaymentEditFormData] = useState({ date: '', amount: '', validated: false });
      const [isPaymentEditModalOpen, setIsPaymentEditModalOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
        if (selectedPaymentToEdit) {
          setPaymentEditFormData({
            date: selectedPaymentToEdit.date,
            amount: selectedPaymentToEdit.amount,
            validated: selectedPaymentToEdit.validated,
          });
        }
      }, [selectedPaymentToEdit]);

      const openPaymentValidationModal = (client) => {
        setSelectedClientForPayments(client);
        setIsPaymentModalOpen(true);
      };

      const handleValidatePayment = async (clientId, paymentId) => {
        setIsLoading(true);
        const success = await validatePayment(clientId, paymentId);
        if (success) {
          toast({ title: "Pago Validado", description: "El pago ha sido marcado como validado." });
          await fetchData(); 
          const updatedClient = allClients.find(c => c.id === clientId);
          if (updatedClient) { 
             setSelectedClientForPayments(updatedClient);
          } else {
            setSelectedClientForPayments(null); 
          }
        }
        setIsLoading(false);
      };

      const openEditPaymentModal = (payment) => {
        setSelectedPaymentToEdit(payment);
        setIsPaymentEditModalOpen(true);
      };

      const handlePaymentEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPaymentEditFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      };

      const handlePaymentEditSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const paymentDataToUpdate = {
          ...selectedPaymentToEdit,
          ...paymentEditFormData,
          amount: parseFloat(paymentEditFormData.amount),
        };
        const success = await updatePayment(selectedClientForPayments.id, paymentDataToUpdate);
        if (success) {
          toast({ title: "Pago Actualizado", description: "El pago ha sido actualizado."});
          await fetchData();
          const updatedClient = allClients.find(c => c.id === selectedClientForPayments.id);
           if (updatedClient) {
             setSelectedClientForPayments(updatedClient);
          } else {
            setSelectedClientForPayments(null);
          }
        }
        setIsLoading(false);
        if (!isLoading) {
          setIsPaymentEditModalOpen(false);
          setSelectedPaymentToEdit(null);
        }
      };

      if (dataLoading) {
        return <p className="text-center text-gray-300 py-4">Cargando datos de pagos...</p>;
      }
      
      const currentClientPayments = selectedClientForPayments ? allClients.find(c => c.id === selectedClientForPayments.id)?.payments || [] : [];


      return (
        <div className="mt-6">
           <h3 className="text-xl font-semibold text-green-300 mb-4">Validación y Gestión de Pagos de Clientes</h3>
           <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/30">
                <TableHead className="text-gray-300">ID Cliente</TableHead>
                <TableHead className="text-gray-300">Nombre Cliente</TableHead>
                <TableHead className="text-gray-300">Pagos Pendientes</TableHead>
                <TableHead className="text-gray-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allClients.map(client => (
                <TableRow key={client.id} className="border-slate-700 hover:bg-slate-800/30">
                  <TableCell className="text-gray-200">{client.client_id}</TableCell>
                  <TableCell className="text-gray-200">{client.name}</TableCell>
                  <TableCell className="text-gray-200">{(client.payments || []).filter(p => !p.validated).length}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openPaymentValidationModal(client)} className="text-green-400 hover:text-green-300">
                      <Eye className="h-4 w-4 mr-1" /> Ver/Validar Pagos
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
           </Table>

          {selectedClientForPayments && (
            <Dialog open={isPaymentModalOpen} onOpenChange={(isOpen) => { setIsPaymentModalOpen(isOpen); if (!isOpen) setSelectedClientForPayments(null); }}>
              <DialogContent className="max-w-2xl glassmorphism border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Pagos de {selectedClientForPayments.name}</DialogTitle>
                  <DialogDescription className="text-gray-400">Revisa y valida los pagos pendientes.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4">
                  {currentClientPayments.length > 0 ? (
                    <Table>
                      <TableHeader><TableRow className="border-slate-700 hover:bg-slate-800/30"><TableHead className="text-gray-300">Fecha</TableHead><TableHead className="text-gray-300">Monto</TableHead><TableHead className="text-gray-300">Comprobante</TableHead><TableHead className="text-gray-300">Estado</TableHead><TableHead className="text-gray-300">Acción</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {[...currentClientPayments].sort((a,b) => new Date(b.date) - new Date(a.date)).map(payment => (
                          <TableRow key={payment.id} className="border-slate-700 hover:bg-slate-800/30">
                            <TableCell className="text-gray-200">{new Date(payment.date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-gray-200">${parseFloat(payment.amount).toFixed(2)}</TableCell>
                            <TableCell className="text-gray-200">{payment.voucher_url}</TableCell>
                            <TableCell className={payment.validated ? "text-green-400" : "text-yellow-400"}>{payment.validated ? "Validado" : "Pendiente"}</TableCell>
                            <TableCell>
                              {!payment.validated && (
                                <Button size="sm" onClick={() => handleValidatePayment(selectedClientForPayments.id, payment.id)} className="bg-green-500 hover:bg-green-600 text-white mr-2" disabled={isLoading}>{isLoading ? "Validando..." : "Validar"}</Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => openEditPaymentModal(payment)} className="text-yellow-400 hover:text-yellow-300" disabled={isLoading}><Edit3 className="h-4 w-4"/></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : <p className="text-gray-400 text-center py-4">No hay pagos registrados para este cliente.</p>}
                </div>
                <DialogFooter><DialogClose asChild><Button variant="outline" className="text-gray-300 border-slate-600 hover:bg-slate-700" disabled={isLoading}>Cerrar</Button></DialogClose></DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {selectedPaymentToEdit && selectedClientForPayments && (
            <Dialog open={isPaymentEditModalOpen} onOpenChange={setIsPaymentEditModalOpen}>
              <DialogContent className="sm:max-w-md glassmorphism border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Editar Pago</DialogTitle>
                  <DialogDescription className="text-gray-400">Actualizar los detalles del pago.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePaymentEditSubmit} className="space-y-4 pt-2">
                  <div><Label htmlFor="paymentDate" className="text-gray-300">Fecha del Pago</Label><Input id="paymentDate" name="date" type="date" value={paymentEditFormData.date} onChange={handlePaymentEditFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-yellow-500"/></div>
                  <div><Label htmlFor="paymentAmountEdit" className="text-gray-300">Monto del Pago</Label><Input id="paymentAmountEdit" name="amount" type="number" step="0.01" value={paymentEditFormData.amount} onChange={handlePaymentEditFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-yellow-500"/></div>
                  <div className="flex items-center space-x-2">
                    <Input type="checkbox" id="paymentValidated" name="validated" checked={paymentEditFormData.validated} onChange={handlePaymentEditFormChange} className="h-4 w-4 accent-yellow-500"/>
                    <Label htmlFor="paymentValidated" className="text-gray-300">Validado</Label>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsPaymentEditModalOpen(false)} className="text-gray-300 border-slate-600 hover:bg-slate-700" disabled={isLoading}>Cancelar</Button>
                    <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white" disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar Cambios"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      );
    };
    export default PaymentValidationTab;
  