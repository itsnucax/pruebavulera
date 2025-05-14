
    import React from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

    export const PlanFormModal = ({ isOpen, onOpenChange, editingPlan, formData, onFormChange, onSelectChange, onSubmit }) => {
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md glassmorphism border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">{editingPlan ? 'Editar' : 'Crear'} Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4 pt-2">
              <div>
                <Label htmlFor="planName" className="text-gray-300">Nombre del Plan</Label>
                <Input id="planName" name="name" value={formData.name} onChange={onFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500"/>
              </div>
              <div>
                <Label htmlFor="total_installments" className="text-gray-300">Total de Cuotas</Label>
                <Input id="total_installments" name="total_installments" type="number" value={formData.total_installments} onChange={onFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500"/>
              </div>
              <div>
                <Label htmlFor="installment_amount" className="text-gray-300">Monto por Cuota</Label>
                <Input id="installment_amount" name="installment_amount" type="number" step="0.01" value={formData.installment_amount} onChange={onFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500"/>
              </div>
              <div>
                <Label htmlFor="frequency" className="text-gray-300">Frecuencia de Pago</Label>
                <Select name="frequency" value={formData.frequency} onValueChange={onSelectChange}>
                  <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500">
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="semanal" className="hover:bg-slate-700 focus:bg-slate-700">Semanal</SelectItem>
                    <SelectItem value="quincenal" className="hover:bg-slate-700 focus:bg-slate-700">Quincenal</SelectItem>
                    <SelectItem value="mensual" className="hover:bg-slate-700 focus:bg-slate-700">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="planDescription" className="text-gray-300">Descripción (Opcional)</Label>
                <Input id="planDescription" name="description" value={formData.description} onChange={onFormChange} className="bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500"/>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancelar</Button>
                <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">{editingPlan ? 'Guardar Cambios' : 'Crear Plan'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };
  