
    import React from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog.jsx';

    export const PaymentEditModal = ({ isOpen, onOpenChange, formData, onFormChange, onSubmit }) => {
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md glassmorphism border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Pago</DialogTitle>
              <DialogDescription className="text-gray-400">Actualizar los detalles del pago.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4 pt-2">
              <div>
                <Label htmlFor="payment_date" className="text-gray-300">Fecha del Pago</Label>
                <Input id="payment_date" name="payment_date" type="date" value={formData.payment_date} onChange={onFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-yellow-500"/>
              </div>
              <div>
                <Label htmlFor="paymentAmountEdit" className="text-gray-300">Monto del Pago</Label>
                <Input id="paymentAmountEdit" name="amount" type="number" step="0.01" value={formData.amount} onChange={onFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-yellow-500"/>
              </div>
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="paymentValidated" name="validated" checked={formData.validated} onChange={onFormChange} className="h-4 w-4 accent-yellow-500"/>
                <Label htmlFor="paymentValidated" className="text-gray-300">Validado</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancelar</Button>
                <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };
  