
    import React, { useState, useEffect } from 'react';
    import { useData } from '@/contexts/DataContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog.jsx';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
    import { Edit3, PlusCircle, Eye } from 'lucide-react';
    import { useTheme } from '@/contexts/ThemeContext.jsx';

    const AdminClientsTab = () => {
      const { clients, addClient, updateClient, plans } = useData();
      const { toast } = useToast();
      const { theme } = useTheme();

      const [isClientModalOpen, setIsClientModalOpen] = useState(false);
      const [editingClient, setEditingClient] = useState(null);
      const [clientFormData, setClientFormData] = useState({ 
        clientId: '', name: '', password: '', phone: '', assignedPlanId: '', address: '', firstPaymentDate: '' 
      });
      const [isViewClientModalOpen, setIsViewClientModalOpen] = useState(false);
      const [viewingClient, setViewingClient] = useState(null);

      useEffect(() => {
        if (editingClient) {
          setClientFormData({
            clientId: editingClient.clientId,
            name: editingClient.name,
            password: editingClient.password || '',
            phone: editingClient.phone || '',
            assignedPlanId: editingClient.assignedPlanId || '',
            address: editingClient.address || '',
            firstPaymentDate: editingClient.firstPaymentDate || ''
          });
        } else {
          setClientFormData({ clientId: '', name: '', password: '', phone: '', assignedPlanId: '', address: '', firstPaymentDate: '' });
        }
      }, [editingClient]);

      const handleClientFormChange = (e) => {
        const { name, value } = e.target;
        setClientFormData(prev => ({ ...prev, [name]: value }));
      };
      
      const handleClientFormSelectChange = (value) => {
        setClientFormData(prev => ({ ...prev, assignedPlanId: value }));
      };

      const handleClientSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = { ...clientFormData };
        if (!editingClient) {
          dataToSubmit.password = clientFormData.password || Math.random().toString(36).slice(-8); 
        } else if (!clientFormData.password) {
          delete dataToSubmit.password;
        }

        if (editingClient) {
          updateClient({ ...editingClient, ...dataToSubmit });
          toast({ title: "Cliente Actualizado", description: "Los datos del cliente se han actualizado." });
        } else {
          if (clients.find(c => c.clientId === dataToSubmit.clientId)) {
            toast({ variant: "destructive", title: "Error", description: "El ID de cliente ya existe." });
            return;
          }
          addClient(dataToSubmit);
          toast({ title: "Cliente Agregado", description: "El nuevo cliente ha sido registrado." });
        }
        setIsClientModalOpen(false);
        setEditingClient(null);
      };

      const openEditClientModal = (client) => {
        setEditingClient(client);
        setIsClientModalOpen(true);
      };
      
      const openViewClientModal = (client) => {
        setViewingClient(client);
        setIsViewClientModalOpen(true);
      };

      const getPlanName = (planId) => plans.find(p => p.id === planId)?.name || 'N/A';

      const textHeaderClass = theme === 'dark' ? 'text-blue-300' : 'text-blue-700';
      const tableRowClass = theme === 'dark' ? 'border-slate-700 hover:bg-slate-800/30' : 'border-gray-200 hover:bg-gray-50/50';
      const tableHeadClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
      const tableCellClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
      const modalContentClass = theme === 'dark' ? 'glassmorphism border-slate-700' : 'bg-white border-gray-300';
      const modalTitleClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
      const labelClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
      const inputClass = theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500';
      const selectTriggerClass = theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500';
      const selectContentClass = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900';
      const selectItemClass = theme === 'dark' ? 'hover:bg-slate-700 focus:bg-slate-700' : 'hover:bg-gray-100 focus:bg-gray-100';
      const buttonOutlineClass = theme === 'dark' ? 'text-gray-300 border-slate-600 hover:bg-slate-700' : 'text-gray-700 border-gray-300 hover:bg-gray-100';


      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${textHeaderClass}`}>Gestión de Clientes</h3>
            <Button onClick={() => { setEditingClient(null); setIsClientModalOpen(true); }} className="bg-blue-500 hover:bg-blue-600 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Cliente
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className={tableRowClass}>
                <TableHead className={tableHeadClass}>ID Cliente</TableHead>
                <TableHead className={tableHeadClass}>Nombre</TableHead>
                <TableHead className={tableHeadClass}>Teléfono</TableHead>
                <TableHead className={tableHeadClass}>Plan Asignado</TableHead>
                <TableHead className={tableHeadClass}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(client => (
                <TableRow key={client.id} className={tableRowClass}>
                  <TableCell className={tableCellClass}>{client.clientId}</TableCell>
                  <TableCell className={tableCellClass}>{client.name}</TableCell>
                  <TableCell className={tableCellClass}>{client.phone}</TableCell>
                  <TableCell className={tableCellClass}>{getPlanName(client.assignedPlanId)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openViewClientModal(client)} className={`${theme === 'dark' ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'} mr-2`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditClientModal(client)} className={`${theme === 'dark' ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'}`}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Client Modal (Add/Edit) */}
          <Dialog open={isClientModalOpen} onOpenChange={setIsClientModalOpen}>
            <DialogContent className={`sm:max-w-md ${modalContentClass}`}>
              <DialogHeader>
                <DialogTitle className={modalTitleClass}>{editingClient ? 'Editar' : 'Agregar'} Cliente</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleClientSubmit} className="space-y-4 pt-2">
                <div><Label htmlFor="clientId" className={labelClass}>ID Cliente</Label><Input id="clientId" name="clientId" value={clientFormData.clientId} onChange={handleClientFormChange} required className={inputClass} disabled={!!editingClient}/></div>
                <div><Label htmlFor="name" className={labelClass}>Nombre Completo</Label><Input id="name" name="name" value={clientFormData.name} onChange={handleClientFormChange} required className={inputClass}/></div>
                <div><Label htmlFor="password" className={labelClass}>Contraseña {editingClient ? '(Dejar en blanco para no cambiar)' : ''}</Label><Input id="password" name="password" type="password" value={clientFormData.password} onChange={handleClientFormChange} required={!editingClient} className={inputClass}/></div>
                <div><Label htmlFor="phone" className={labelClass}>Teléfono</Label><Input id="phone" name="phone" value={clientFormData.phone} onChange={handleClientFormChange} className={inputClass}/></div>
                <div><Label htmlFor="address" className={labelClass}>Dirección</Label><Input id="address" name="address" value={clientFormData.address} onChange={handleClientFormChange} className={inputClass}/></div>
                <div><Label htmlFor="firstPaymentDate" className={labelClass}>Fecha de Primer Pago</Label><Input id="firstPaymentDate" name="firstPaymentDate" type="date" value={clientFormData.firstPaymentDate} onChange={handleClientFormChange} className={inputClass}/></div>
                <div>
                  <Label htmlFor="assignedPlanId" className={labelClass}>Asignar Plan</Label>
                  <Select name="assignedPlanId" value={clientFormData.assignedPlanId} onValueChange={handleClientFormSelectChange}>
                    <SelectTrigger className={`w-full ${selectTriggerClass}`}>
                      <SelectValue placeholder="Seleccionar un plan" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      {plans.map(plan => <SelectItem key={plan.id} value={plan.id} className={selectItemClass}>{plan.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsClientModalOpen(false)} className={buttonOutlineClass}>Cancelar</Button>
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">{editingClient ? 'Guardar Cambios' : 'Agregar Cliente'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* View Client Modal */}
          {viewingClient && (
            <Dialog open={isViewClientModalOpen} onOpenChange={setIsViewClientModalOpen}>
              <DialogContent className={`sm:max-w-md ${modalContentClass}`}>
                <DialogHeader>
                  <DialogTitle className={modalTitleClass}>Detalles del Cliente: {viewingClient.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2 text-sm">
                  <p><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>ID Cliente:</strong> <span className={tableCellClass}>{viewingClient.clientId}</span></p>
                  <p><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Nombre Completo:</strong> <span className={tableCellClass}>{viewingClient.name}</span></p>
                  <p><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Teléfono:</strong> <span className={tableCellClass}>{viewingClient.phone || 'N/A'}</span></p>
                  <p><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Dirección:</strong> <span className={tableCellClass}>{viewingClient.address || 'N/A'}</span></p>
                  <p><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Fecha de Primer Pago:</strong> <span className={tableCellClass}>{viewingClient.firstPaymentDate ? new Date(viewingClient.firstPaymentDate + 'T00:00:00').toLocaleDateString() : 'N/A'}</span></p>
                  <p><strong className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Plan Asignado:</strong> <span className={tableCellClass}>{getPlanName(viewingClient.assignedPlanId)}</span></p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className={buttonOutlineClass}>Cerrar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

        </div>
      );
    };
    export default AdminClientsTab;
  