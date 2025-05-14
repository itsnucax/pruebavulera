
    import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
    import { Input } from '@/components/ui/input.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { RefreshCcw } from 'lucide-react';

    const AdminValidatedVouchersTab = () => {
      const [validatedVouchers, setValidatedVouchers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const { toast } = useToast();
      const [searchTerm, setSearchTerm] = useState('');
      const [filterDate, setFilterDate] = useState('');

      const fetchValidatedVouchers = async () => {
        setLoading(true);
        setError(null);
        try {
          let query = supabase.from('comprobantes_validados').select('*').order('validated_at', { ascending: false });

          if (searchTerm) {
            query = query.or(`client_id.ilike.%${searchTerm}%,client_name.ilike.%${searchTerm}%,voucher_url.ilike.%${searchTerm}%`);
          }
          if (filterDate) {
            query = query.gte('validated_at', `${filterDate}T00:00:00.000Z`)
                         .lte('validated_at', `${filterDate}T23:59:59.999Z`);
          }
          
          const { data, error: supabaseError } = await query;

          if (supabaseError) {
            throw supabaseError;
          }
          setValidatedVouchers(data || []);
        } catch (e) {
          setError(e.message);
          toast({ variant: "destructive", title: "Error al cargar comprobantes", description: e.message });
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchValidatedVouchers();
      }, []); 
      
      const handleSearch = () => {
        fetchValidatedVouchers();
      };

      const handleClearFilters = () => {
        setSearchTerm('');
        setFilterDate('');
        fetchValidatedVouchers(); 
      };


      if (loading) return <p className="text-center py-8 text-gray-300">Cargando comprobantes validados...</p>;
      if (error) return <p className="text-center py-8 text-red-400">Error: {error}</p>;

      return (
        <div>
          <h3 className="text-xl font-semibold text-teal-300 mb-4">Comprobantes Validados en Supabase</h3>
          
          <div className="flex flex-wrap gap-4 mb-6 p-4 border border-slate-700 rounded-lg bg-slate-800/30">
            <Input 
              type="text" 
              placeholder="Buscar por ID cliente, nombre, voucher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-teal-500"
            />
            <Input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="max-w-xs bg-slate-700/50 border-slate-600 text-white focus:ring-teal-500"
            />
            <Button onClick={handleSearch} className="bg-teal-500 hover:bg-teal-600 text-white">Buscar</Button>
            <Button onClick={handleClearFilters} variant="outline" className="text-gray-300 border-slate-600 hover:bg-slate-700">Limpiar Filtros</Button>
             <Button onClick={fetchValidatedVouchers} variant="ghost" className="text-teal-400 hover:text-teal-300 ml-auto">
                <RefreshCcw className="h-5 w-5 mr-2" /> Actualizar Lista
            </Button>
          </div>

          {validatedVouchers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/30">
                  <TableHead className="text-gray-300">ID Cliente</TableHead>
                  <TableHead className="text-gray-300">Nombre Cliente</TableHead>
                  <TableHead className="text-gray-300">Fecha Pago</TableHead>
                  <TableHead className="text-gray-300">Monto</TableHead>
                  <TableHead className="text-gray-300">URL Comprobante</TableHead>
                  <TableHead className="text-gray-300">Fecha Validación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validatedVouchers.map(voucher => (
                  <TableRow key={voucher.id} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-gray-200">{voucher.client_id}</TableCell>
                    <TableCell className="text-gray-200">{voucher.client_name}</TableCell>
                    <TableCell className="text-gray-200">{new Date(voucher.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-gray-200">${voucher.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-200 truncate max-w-xs">{voucher.voucher_url}</TableCell>
                    <TableCell className="text-gray-200">{new Date(voucher.validated_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-400 text-center py-8">No hay comprobantes validados que coincidan con los filtros o no se han validado comprobantes aún.</p>
          )}
        </div>
      );
    };

    export default AdminValidatedVouchersTab;
  