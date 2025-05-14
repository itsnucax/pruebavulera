
    import React, { useState, useEffect } from 'react';
    import { useData } from '@/contexts/DataContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
    import { Edit3, PlusCircle } from 'lucide-react';
    import { useTheme } from '@/contexts/ThemeContext.jsx';

    const AdminPlansTab = () => {
      const { plans, addPlan, updatePlan } = useData();
      const { toast } = useToast();
      const { theme } = useTheme();

      const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
      const [editingPlan, setEditingPlan] = useState(null);
      const [planFormData, setPlanFormData] = useState({ 
        name: '', totalInstallments: '', installmentAmount: '', frequency: 'mensual', description: '' 
      });

      useEffect(() => {
        if (editingPlan) {
          setPlanFormData({
            name: editingPlan.name,
            totalInstallments: editingPlan.totalInstallments,
            installmentAmount: editingPlan.installmentAmount,
            frequency: editingPlan.frequency,
            description: editingPlan.description || '',
          });
        } else {
          setPlanFormData({ name: '', totalInstallments: '', installmentAmount: '', frequency: 'mensual', description: '' });
        }
      }, [editingPlan]);

      const handlePlanFormChange = (e) => {
        const { name, value } = e.target;
        setPlanFormData(prev => ({ ...prev, [name]: value }));
      };
      
      const handlePlanFormSelectChange = (value) => {
         setPlanFormData(prev => ({ ...prev, frequency: value }));
      };

      const handlePlanSubmit = (e) => {
        e.preventDefault();
        const planData = {
          ...planFormData,
          totalInstallments: parseInt(planFormData.totalInstallments),
          installmentAmount: parseFloat(planFormData.installmentAmount),
        };
        if (editingPlan) {
          updatePlan({ ...editingPlan, ...planData });
          toast({ title: "Plan Actualizado", description: "Los datos del plan se han actualizado." });
        } else {
          addPlan(planData);
          toast({ title: "Plan Creado", description: "El nuevo plan de financiamiento ha sido creado." });
        }
        setIsPlanModalOpen(false);
        setEditingPlan(null);
      };

      const openEditPlanModal = (plan) => {
        setEditingPlan(plan);
        setIsPlanModalOpen(true);
      };

      const textHeaderClass = theme === 'dark' ? 'text-purple-300' : 'text-purple-700';
      const tableRowClass = theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-200 hover:bg-gray-50/50';
      const tableHeadClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
      const tableCellClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
      const modalContentClass = theme === 'dark' ? 'glassmorphism border-slate-700' : 'bg-white border-gray-300';
      const modalTitleClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
      const labelClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
      const inputClass = theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-purple-500';
      const selectTriggerClass = theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-purple-500';
      const selectContentClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900';
      const selectItemClass = theme === 'dark' ? 'hover:bg-slate-700 focus:bg-slate-700' : 'hover:bg-gray-100 focus:bg-gray-100';
      const buttonOutlineClass = theme === 'dark' ? 'text-gray-300 border-slate-600 hover:bg-slate-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100';

      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${textHeaderClass}`}>Gestión de Planes</h3>
            <Button onClick={() => { setEditingPlan(null); setIsPlanModalOpen(true); }} className="bg-purple-500 hover:bg-purple-600 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Crear Plan
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className={tableRowClass}>
                <TableHead className={tableHeadClass}>Nombre del Plan</TableHead>
                <TableHead className={tableHeadClass}>Cuotas</TableHead>
                <TableHead className={tableHeadClass}>Monto Cuota</TableHead>
                <TableHead className={tableHeadClass}>Frecuencia</TableHead>
                <TableHead className={tableHeadClass}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(plan => (
                <TableRow key={plan.id} className={tableRowClass}>
                  <TableCell className={tableCellClass}>{plan.name}</TableCell>
                  <TableCell className={tableCellClass}>{plan.totalInstallments}</TableCell>
                  <TableCell className={tableCellClass}>${plan.installmentAmount.toFixed(2)}</TableCell>
                  <TableCell className={`${tableCellClass} capitalize`}>{plan.frequency}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openEditPlanModal(plan)} className={`${theme === 'dark' ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'}`}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Plan Modal */}
          <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
            <DialogContent className={`sm:max-w-md ${modalContentClass}`}>
              <DialogHeader>
                <DialogTitle className={modalTitleClass}>{editingPlan ? 'Editar' : 'Crear'} Plan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePlanSubmit} className="space-y-4 pt-2">
                <div><Label htmlFor="planName" className={labelClass}>Nombre del Plan</Label><Input id="planName" name="name" value={planFormData.name} onChange={handlePlanFormChange} required className={inputClass}/></div>
                <div><Label htmlFor="totalInstallments" className={labelClass}>Total de Cuotas</Label><Input id="totalInstallments" name="totalInstallments" type="number" value={planFormData.totalInstallments} onChange={handlePlanFormChange} required className={inputClass}/></div>
                <div><Label htmlFor="installmentAmount" className={labelClass}>Monto por Cuota</Label><Input id="installmentAmount" name="installmentAmount" type="number" step="0.01" value={planFormData.installmentAmount} onChange={handlePlanFormChange} required className={inputClass}/></div>
                <div>
                  <Label htmlFor="frequency" className={labelClass}>Frecuencia de Pago</Label>
                  <Select name="frequency" value={planFormData.frequency} onValueChange={handlePlanFormSelectChange}>
                    <SelectTrigger className={`w-full ${selectTriggerClass}`}>
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="semanal" className={selectItemClass}>Semanal</SelectItem>
                      <SelectItem value="quincenal" className={selectItemClass}>Quincenal</SelectItem>
                      <SelectItem value="mensual" className={selectItemClass}>Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label htmlFor="planDescription" className={labelClass}>Descripción (Opcional)</Label><Input id="planDescription" name="description" value={planFormData.description} onChange={handlePlanFormChange} className={inputClass}/></div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsPlanModalOpen(false)} className={buttonOutlineClass}>Cancelar</Button>
                  <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">{editingPlan ? 'Guardar Cambios' : 'Crear Plan'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      );
    };
    export default AdminPlansTab;
  