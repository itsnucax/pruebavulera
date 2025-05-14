
    import React, { useState, useEffect } from 'react';
    import { useData } from '@/contexts/DataContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
    import { Edit3, PlusCircle } from 'lucide-react';

    const PlanManagementTab = () => {
      const { plans, addPlan, updatePlan, loading: dataLoading } = useData();
      const { toast } = useToast();

      const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
      const [editingPlan, setEditingPlan] = useState(null);
      const [planFormData, setPlanFormData] = useState({ name: '', total_installments: '', installment_amount: '', frequency: 'mensual', description: '' });
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
        if (editingPlan) {
          setPlanFormData({
            name: editingPlan.name,
            total_installments: editingPlan.total_installments,
            installment_amount: editingPlan.installment_amount,
            frequency: editingPlan.frequency,
            description: editingPlan.description || '',
          });
        } else {
          setPlanFormData({ name: '', total_installments: '', installment_amount: '', frequency: 'mensual', description: '' });
        }
      }, [editingPlan]);

      const handlePlanFormChange = (e) => {
        const { name, value } = e.target;
        setPlanFormData(prev => ({ ...prev, [name]: value }));
      };
      
      const handlePlanFormSelectChange = (value) => {
         setPlanFormData(prev => ({ ...prev, frequency: value }));
      };

      const handlePlanSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const planDataPayload = {
          ...planFormData,
          total_installments: parseInt(planFormData.total_installments),
          installment_amount: parseFloat(planFormData.installment_amount),
        };
        if (editingPlan) {
          const success = await updatePlan({ ...editingPlan, ...planDataPayload });
          if (success) toast({ title: "Plan Actualizado", description: "Los datos del plan se han actualizado." });
        } else {
          const success = await addPlan(planDataPayload);
          if (success) toast({ title: "Plan Creado", description: "El nuevo plan de financiamiento ha sido creado." });
        }
        setIsLoading(false);
        if (!isLoading) {
          setIsPlanModalOpen(false);
          setEditingPlan(null);
        }
      };

      const openEditPlanModal = (plan) => {
        setEditingPlan(plan);
        setIsPlanModalOpen(true);
      };

      if (dataLoading) {
        return <p className="text-center text-gray-300 py-4">Cargando planes...</p>;
      }

      return (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-purple-300">Gestión de Planes</h3>
            <Button onClick={() => { setEditingPlan(null); setIsPlanModalOpen(true); }} className="bg-purple-500 hover:bg-purple-600 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Plan
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/30">
                <TableHead className="text-gray-300">Nombre del Plan</TableHead>
                <TableHead className="text-gray-300">Cuotas</TableHead>
                <TableHead className="text-gray-300">Monto Cuota</TableHead>
                <TableHead className="text-gray-300">Frecuencia</TableHead>
                <TableHead className="text-gray-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(plan => (
                <TableRow key={plan.id} className="border-slate-700 hover:bg-slate-800/30">
                  <TableCell className="text-gray-200">{plan.name}</TableCell>
                  <TableCell className="text-gray-200">{plan.total_installments}</TableCell>
                  <TableCell className="text-gray-200">${parseFloat(plan.installment_amount).toFixed(2)}</TableCell>
                  <TableCell className="text-gray-200 capitalize">{plan.frequency}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openEditPlanModal(plan)} className="text-yellow-400 hover:text-yellow-300">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
            <DialogContent className="sm:max-w-md glassmorphism border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingPlan ? 'Editar' : 'Crear'} Plan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePlanSubmit} className="space-y-4 pt-2">
                <div><Label htmlFor="planName" className="text-gray-300">Nombre del Plan</Label><Input id="planName" name="name" value={planFormData.name} onChange={handlePlanFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500"/></div>
                <div><Label htmlFor="total_installments" className="text-gray-300">Total de Cuotas</Label><Input id="total_installments" name="total_installments" type="number" value={planFormData.total_installments} onChange={handlePlanFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500"/></div>
                <div><Label htmlFor="installment_amount" className="text-gray-300">Monto por Cuota</Label><Input id="installment_amount" name="installment_amount" type="number" step="0.01" value={planFormData.installment_amount} onChange={handlePlanFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500"/></div>
                <div>
                  <Label htmlFor="frequency" className="text-gray-300">Frecuencia de Pago</Label>
                  <Select name="frequency" value={planFormData.frequency} onValueChange={handlePlanFormSelectChange}>
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
                <div><Label htmlFor="planDescription" className="text-gray-300">Descripción (Opcional)</Label><Input id="planDescription" name="description" value={planFormData.description} onChange={handlePlanFormChange} className="bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500"/></div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsPlanModalOpen(false)} className="text-gray-300 border-slate-600 hover:bg-slate-700" disabled={isLoading}>Cancelar</Button>
                  <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white" disabled={isLoading}>{isLoading ? "Guardando..." : (editingPlan ? 'Guardar Cambios' : 'Crear Plan')}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      );
    };
    export default PlanManagementTab;
  