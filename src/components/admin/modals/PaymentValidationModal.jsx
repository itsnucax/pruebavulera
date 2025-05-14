
    import React from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog.jsx';
    import { Edit3 } from 'lucide-react';

    export const PaymentValidationModal = ({ isOpen, onOpenChange, selectedClient, onValidatePayment, onEditPayment }) => {
      if (!selectedClient) return null;

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl glassmorphism border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Pagos de {selectedClient.full_name}</DialogTitle>
              <DialogDescription className="text-gray-400">Revisa y valida los pagos pendientes.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4">
              {selectedClient.payments && selectedClient.payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/30">
                      <TableHead className="text-gray-300">Fecha</TableHead>
                      <TableHead className="text-gray-300">Monto</TableHead>
                      <TableHead className="text-gray-300">Comprobante</TableHead>
                      <TableHead className="text-gray-300">Estado</TableHead>
                      <TableHead className="text-gray-300">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClient.payments.sort((a,b) => new Date(b.payment_date) - new Date(a.payment_date)).map(payment => (
                      <TableRow key={payment.id} className="border-slate-700 hover:bg-slate-800/30">
                        <TableCell className="text-gray-200">{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-gray-200">${parseFloat(payment.amount).toFixed(2)}</TableCell>
                        <TableCell className="text-gray-200">
                          {payment.voucher_url ? 
                            <a href={payment.voucher_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                              {payment.voucher_filename || 'Ver Comprobante'}
                            </a> : 'N/A'
                          }
                        </TableCell>
                        <TableCell className={payment.validated ? "text-green-400" : "text-yellow-400"}>{payment.validated ? "Validado" : "Pendiente"}</TableCell>
                        <TableCell>
                          {!payment.validated && (
                            <Button size="sm" onClick={() => onValidatePayment(payment.id)} className="bg-green-500 hover:bg-green-600 text-white mr-2">Validar</Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => onEditPayment(payment)} className="text-yellow-400 hover:text-yellow-300"><Edit3 className="h-4 w-4"/></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <p className="text-gray-400 text-center py-4">No hay pagos registrados para este cliente.</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="text-gray-300 border-slate-600 hover:bg-slate-700">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };
  