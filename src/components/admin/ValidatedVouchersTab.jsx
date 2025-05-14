
    import React from 'react';
    import { useData } from '@/contexts/DataContext.jsx';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
    import { formatDate } from '@/lib/dateUtils.jsx';
    import { CheckCircle } from 'lucide-react';

    const ValidatedVouchersTab = () => {
      const { clients, getPlanById } = useData();

      const validatedPayments = clients.reduce((acc, client) => {
        const clientPlan = getPlanById(client.assigned_plan_id);
        (client.payments || [])
          .filter(payment => payment.validated)
          .forEach(payment => {
            acc.push({
              clientName: client.name,
              clientId: client.client_id,
              planName: clientPlan ? clientPlan.name : 'N/A',
              paymentDate: payment.date,
              paymentAmount: payment.amount,
              voucherUrl: payment.voucherUrl,
              paymentId: payment.id
            });
          });
        return acc;
      }, []).sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

      return (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-teal-300 mb-4">Comprobantes Validados</h3>
          {validatedPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/30">
                    <TableHead className="text-gray-300 text-xs sm:text-sm">Cliente</TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">ID Cliente</TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm">Plan</TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm">Fecha Pago</TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm">Monto</TableHead>
                    <TableHead className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">Comprobante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validatedPayments.map(payment => (
                    <TableRow key={`${payment.clientId}-${payment.paymentId}`} className="border-slate-700 hover:bg-slate-800/30">
                      <TableCell className="text-gray-200 text-xs sm:text-sm">{payment.clientName}</TableCell>
                      <TableCell className="text-gray-200 text-xs sm:text-sm hidden md:table-cell">{payment.clientId}</TableCell>
                      <TableCell className="text-gray-200 text-xs sm:text-sm">{payment.planName}</TableCell>
                      <TableCell className="text-gray-200 text-xs sm:text-sm">{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell className="text-gray-200 text-xs sm:text-sm">${payment.paymentAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-200 text-xs sm:text-sm hidden lg:table-cell truncate max-w-[150px]">{payment.voucherUrl}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <CheckCircle className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg">No hay comprobantes validados aún.</p>
              <p className="text-gray-500 text-sm">Cuando valides pagos, aparecerán aquí.</p>
            </div>
          )}
        </div>
      );
    };

    export default ValidatedVouchersTab;
  