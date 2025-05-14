
    import React from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";

    export const ClientFormModal = ({ isOpen, onOpenChange, editingClient, formData, onFormChange, onSelectChange, onSubmit, plans }) => {
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md glassmorphism border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">{editingClient ? 'Editar' : 'Agregar'} Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4 pt-2">
              <div>
                <Label htmlFor="client_identifier" className="text-gray-300">ID Cliente (Usuario)</Label>
                <Input id="client_identifier" name="client_identifier" value={formData.client_identifier} onChange={onFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500" disabled={!!editingClient}/>
              </div>
              <div>
                <Label htmlFor="full_name" className="text-gray-300">Nombre Completo</Label>
                <Input id="full_name" name="full_name" value={formData.full_name} onChange={onFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500"/>
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-300">Contraseña {editingClient ? '(Dejar en blanco para no cambiar)' : ''}</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={onFormChange} required={!editingClient} className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500"/>
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-300">Teléfono</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={onFormChange} className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500"/>
              </div>
              <div>
                <Label htmlFor="address" className="text-gray-300">Dirección</Label>
                <Input id="address" name="address" value={formData.address} onChange={onFormChange} className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500"/>
              </div>
              <div>
                <Label htmlFor="assigned_plan_id" className="text-gray-300">Asignar Plan</Label>
                <Select name="assigned_plan_id" value={formData.assigned_plan_id} onValueChange={onSelectChange}>
                  <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500">
                    <SelectValue placeholder="Seleccionar un plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="" className="hover:bg-slate-700 focus:bg-slate-700">Ninguno</SelectItem>
                    {plans.map(plan => <SelectItem key={plan.id} value={plan.id} className="hover:bg-slate-700 focus:bg-slate-700">{plan.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancelar</Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">{editingClient ? 'Guardar Cambios' : 'Agregar Cliente'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };
  