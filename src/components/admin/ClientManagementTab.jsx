
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

    const ClientManagementTab = () => {
      const { clients, addClient, updateClient, plans, loading: dataLoading } = useData();
      const { toast } = useToast();

      const [isClientModalOpen, setIsClientModalOpen] = useState(false);
      const [editingClient, setEditingClient] = useState(null);
      const [clientFormData, setClientFormData] = useState({ client_id: '', name: '', password: '', email: '', phone: '', assigned_plan_id: '' });
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
        if (editingClient) {
          setClientFormData({
            client_id: editingClient.client_id,
            name: editingClient.name,
            password: '', 
            email: editingClient.email || '',
            phone: editingClient.phone || '',
            assigned_plan_id: editingClient.assigned_plan_id || '',
          });
        } else {
          setClientFormData({ client_id: '', name: '', password: '', email: '', phone: '', assigned_plan_id: '' });
        }
      }, [editingClient]);

      const handleClientFormChange = (e) => {
        const { name, value } = e.target;
        setClientFormData(prev => ({ ...prev, [name]: value }));
      };
      
      const handleClientFormSelectChange = (value) => {
        setClientFormData(prev => ({ ...prev, assigned_plan_id: value }));
      };

      const handleClientSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const clientPayload = { ...clientFormData };
        if (!clientPayload.password && editingClient) {
          delete clientPayload.password; 
        } else if (!clientPayload.password && !editingClient) {
          toast({ variant: "destructive", title: "Error", description: "La contraseña es obligatoria para nuevos clientes." });
          setIsLoading(false);
          return;
        }


        if (editingClient) {
          const success = await updateClient({ ...editingClient, ...clientPayload });
          if (success) toast({ title: "Cliente Actualizado", description: "Los datos del cliente se han actualizado." });
        } else {
          const existingClient = clients.find(c => c.client_id === clientPayload.client_id);
          if (existingClient) {
            toast({ variant: "destructive", title: "Error", description: "El ID de cliente ya existe." });
            setIsLoading(false);
            return;
          }
          const success = await addClient(clientPayload);
          if (success) toast({ title: "Cliente Agregado", description: "El nuevo cliente ha sido registrado." });
        }
        setIsLoading(false);
        if (!isLoading) { 
          setIsClientModalOpen(false);
          setEditingClient(null);
        }
      };

      const openEditClientModal = (client) => {
        setEditingClient(client);
        setIsClientModalOpen(true);
      };
      
      const getPlanName = (planId) => plans.find(p => p.id === planId)?.name || 'N/A';

      if (dataLoading) {
        return <p className="text-center text-gray-300 py-4">Cargando clientes...</p>;
      }

      return (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-300">Gestión de Clientes</h3>
            <Button onClick={() => { setEditingClient(null); setIsClientModalOpen(true); }} className="bg-blue-500 hover:bg-blue-600 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Cliente
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/30">
                <TableHead className="text-gray-300">ID Cliente</TableHead>
                <TableHead className="text-gray-300">Nombre</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Plan Asignado</TableHead>
                <TableHead className="text-gray-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(client => (
                <TableRow key={client.id} className="border-slate-700 hover:bg-slate-800/30">
                  <TableCell className="text-gray-200">{client.client_id}</TableCell>
                  <TableCell className="text-gray-200">{client.name}</TableCell>
                  <TableCell className="text-gray-200">{client.email}</TableCell>
                  <TableCell className="text-gray-200">{getPlanName(client.assigned_plan_id)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openEditClientModal(client)} className="text-yellow-400 hover:text-yellow-300">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={isClientModalOpen} onOpenChange={setIsClientModalOpen}>
            <DialogContent className="sm:max-w-md glassmorphism border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">{editingClient ? 'Editar' : 'Agregar'} Cliente</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleClientSubmit} className="space-y-4 pt-2">
                <div><Label htmlFor="client_id" className="text-gray-300">ID Cliente</Label><Input id="client_id" name="client_id" value={clientFormData.client_id} onChange={handleClientFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500" disabled={!!editingClient}/></div>
                <div><Label htmlFor="name" className="text-gray-300">Nombre Completo</Label><Input id="name" name="name" value={clientFormData.name} onChange={handleClientFormChange} required className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500"/></div>
                <div><Label htmlFor="password" className="text-gray-300">Contraseña {editingClient && "(Dejar en blanco para no cambiar)"}</Label><Input id="password" name="password" type="password" value={clientFormData.password} onChange={handleClientFormChange} required={!editingClient} className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500"/></div>
                <div><Label htmlFor="email" className="text-gray-300">Email</Label><Input id="email" name="email" type="email" value={clientFormData.email} onChange={handleClientFormChange} className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500"/></div>
                <div><Label htmlFor="phone" className="text-gray-300">Teléfono</Label><Input id="phone" name="phone" value={clientFormData.phone} onChange={handleClientFormChange} className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500"/></div>
                <div>
                  <Label htmlFor="assigned_plan_id" className="text-gray-300">Asignar Plan</Label>
                  <Select name="assigned_plan_id" value={clientFormData.assigned_plan_id} onValueChange={handleClientFormSelectChange}>
                    <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500">
                      <SelectValue placeholder="Seleccionar un plan" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {plans.map(plan => <SelectItem key={plan.id} value={plan.id} className="hover:bg-slate-700 focus:bg-slate-700">{plan.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsClientModalOpen(false)} className="text-gray-300 border-slate-600 hover:bg-slate-700" disabled={isLoading}>Cancelar</Button>
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>{isLoading ? "Guardando..." : (editingClient ? 'Guardar Cambios' : 'Agregar Cliente')}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      );
    };
    export default ClientManagementTab;
  