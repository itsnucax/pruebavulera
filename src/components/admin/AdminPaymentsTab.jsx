
    import React, { useState, useEffect } from 'react';
    import { useData } from '@/contexts/DataContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';
    import { Edit3, Eye } from 'lucide-react';
    import { useTheme } from '@/contexts/ThemeContext.jsx';

    const AdminPaymentsTab = () => {
      const { clients, validatePayment, updatePayment } = useData();
      const { toast } = useToast();
      const { theme } = useTheme();

      const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
      const [selectedClientPayments, setSelectedClientPayments] = useState(null);
      const [selectedPaymentToEdit, setSelectedPaymentToEdit] = useState(null);
      const [paymentEditFormData, setPaymentEditFormData] = useState({ date: '', amount: '', validated: false });
      const [isPaymentEditModalOpen, setIsPaymentEditModalOpen] = useState(false);

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
        setSelectedClientPayments(client);
        setIsPaymentModalOpen(true);
      };

      const handleValidatePayment = (clientId, paymentId) => {
        validatePayment(clientId, paymentId);
        toast({ title: "Pago Validado", description: "El pago ha sido marcado como validado." });
        const updatedClient = clients.find(c => c.id === clientId);
        setSelectedClientPayments(updatedClient);
      };

      const openEditPaymentModal = (payment) => {
        setSelectedPaymentToEdit(payment);
        setIsPaymentEditModalOpen(true);
      };

      const handlePaymentEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPaymentEditFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      };

      const handlePaymentEditSubmit = (e) => {
        e.preventDefault();
        const paymentDataToUpdate = {
          ...selectedPaymentToEdit,
          ...paymentEditFormData,
          amount: parseFloat(paymentEditFormData.amount),
        };
        updatePayment(selectedClientPayments.id, paymentDataToUpdate);
        toast({ title: "Pago Actualizado", description: "El pago ha sido actualizado."});
        setIsPaymentEditModalOpen(false);
        setSelectedPaymentToEdit(null);
        const updatedClient = clients.find(c => c.id === selectedClientPayments.id);
        setSelectedClientPayments(updatedClient); 
      };

      const textHeaderClass = theme === 'dark' ? 'text-green-300' : 'text-green-700';
      const tableRowClass = theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-200 hover:bg-gray-50/50';
      const tableHeadClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
      const tableCellClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
      const modalContentClass = theme === 'dark' ? 'glassmorphism border-slate-700' : 'bg-white border-gray-300';
      const modalTitleClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
      const modalDescriptionClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
      const labelClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
      const inputClass = theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-yellow-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-yellow-500';
      const buttonOutlineClass = theme === 'dark' ? 'text-gray-300 border-slate-600 hover:bg-slate-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100';


      return (
        <div>
          <h3 className={`text-xl font-semibold ${textHeaderClass} mb-4`}>Validación y Gestión de Pagos de Clientes</h3>
           <Table>
            <TableHeader>
              <TableRow className={tableRowClass}>
                <TableHead className={tableHeadClass}>ID Cliente</TableHead>
                <TableHead className={tableHeadClass}>Nombre Cliente</TableHead>
                <TableHead className={tableHeadClass}>Pagos Pendientes</TableHead>
                <TableHead className={tableHeadClass}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(client => (
                <TableRow key={client.id} className={tableRowClass}>
                  <TableCell className={tableCellClass}>{client.clientId}</TableCell>
                  <TableCell className={tableCellClass}>{client.name}</TableCell>
                  <TableCell className={tableCellClass}>{client.payments.filter(p => !p.validated).length}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openPaymentValidationModal(client)} className={`${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}>
                      <Eye className="h-4 w-4 mr-1" /> Ver/Validar Pagos
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
           </Table>

            {/* Payment Validation Modal */}
            {selectedClientPayments && (
            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
              <DialogContent className={`max-w-2xl ${modalContentClass}`}>
                <DialogHeader>
                  <DialogTitle className={modalTitleClass}>Pagos de {selectedClientPayments.name}</DialogTitle>
                  <DialogDescription className={modalDescriptionClass}>Revisa y valida los pagos pendientes.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4">
                  {selectedClientPayments.payments.length > 0 ? (
                    <Table>
                      <TableHeader><TableRow className={tableRowClass}><TableHead className={tableHeadClass}>Fecha</TableHead><TableHead className={tableHeadClass}>Monto</TableHead><TableHead className={tableHeadClass}>Comprobante</TableHead><TableHead className={tableHeadClass}>Estado</TableHead><TableHead className={tableHeadClass}>Acción</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {selectedClientPayments.payments.sort((a,b) => new Date(b.date) - new Date(a.date)).map(payment => (
                          <TableRow key={payment.id} className={tableRowClass}>
                            <TableCell className={tableCellClass}>{new Date(payment.date).toLocaleDateString()}</TableCell>
                            <TableCell className={tableCellClass}>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell className={tableCellClass}>{payment.voucherUrl}</TableCell>
                            <TableCell className={payment.validated ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')}>{payment.validated ? "Validado" : "Pendiente"}</TableCell>
                            <TableCell>
                              {!payment.validated && (
                                <Button size="sm" onClick={() => handleValidatePayment(selectedClientPayments.id, payment.id)} className="bg-green-500 hover:bg-green-600 text-white mr-2">Validar</Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => openEditPaymentModal(payment)} className={`${theme === 'dark' ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'}`}><Edit3 className="h-4 w-4"/></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : <p className={`${modalDescriptionClass} text-center py-4`}>No hay pagos registrados para este cliente.</p>}
                </div>
                <DialogFooter><DialogClose asChild><Button variant="outline" className={buttonOutlineClass}>Cerrar</Button></DialogClose></DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Payment Edit Modal */}
          {selectedPaymentToEdit && (
            <Dialog open={isPaymentEditModalOpen} onOpenChange={setIsPaymentEditModalOpen}>
              <DialogContent className={`sm:max-w-md ${modalContentClass}`}>
                <DialogHeader>
                  <DialogTitle className={modalTitleClass}>Editar Pago</DialogTitle>
                  <DialogDescription className={modalDescriptionClass}>Actualizar los detalles del pago.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePaymentEditSubmit} className="space-y-4 pt-2">
                  <div><Label htmlFor="paymentDate" className={labelClass}>Fecha del Pago</Label><Input id="paymentDate" name="date" type="date" value={paymentEditFormData.date} onChange={handlePaymentEditFormChange} required className={inputClass}/></div>
                  <div><Label htmlFor="paymentAmountEdit" className={labelClass}>Monto del Pago</Label><Input id="paymentAmountEdit" name="amount" type="number" step="0.01" value={paymentEditFormData.amount} onChange={handlePaymentEditFormChange} required className={inputClass}/></div>
                  <div className="flex items-center space-x-2">
                    <Input type="checkbox" id="paymentValidated" name="validated" checked={paymentEditFormData.validated} onChange={handlePaymentEditFormChange} className={`h-4 w-4 ${theme === 'dark' ? 'accent-yellow-500' : 'accent-yellow-600'}`}/>
                    <Label htmlFor="paymentValidated" className={labelClass}>Validado</Label>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsPaymentEditModalOpen(false)} className={buttonOutlineClass}>Cancelar</Button>
                    <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white">Guardar Cambios</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      );
    };
    export default AdminPaymentsTab;
  