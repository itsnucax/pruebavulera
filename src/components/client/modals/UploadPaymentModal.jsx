
    import React, { useState } from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useData } from '@/contexts/DataContext.jsx';

    export const UploadPaymentModal = ({ isOpen, onOpenChange, clientData }) => {
      const { currentUser } = useAuth();
      const { addPayment } = useData();
      const { toast } = useToast();
      const [voucherFile, setVoucherFile] = useState(null);
      const [paymentAmount, setPaymentAmount] = useState('');

      const handleFileChange = (event) => {
        setVoucherFile(event.target.files[0]);
      };

      const handleUploadPayment = async (e) => {
        e.preventDefault();
        if (!voucherFile || !paymentAmount) {
          toast({ variant: "destructive", title: "Error", description: "Por favor, ingresa el monto y selecciona un archivo." });
          return;
        }

        const fileExt = voucherFile.name.split('.').pop();
        const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`;
        const filePath = `vouchers/${fileName}`;

        try {
          const { error: uploadError } = await supabase.storage
            .from('easyphone-finance-files') 
            .upload(filePath, voucherFile);

          if (uploadError) {
            throw uploadError;
          }
          
          const { data: publicURLData } = supabase.storage.from('easyphone-finance-files').getPublicUrl(filePath);

          const paymentData = {
            payment_date: new Date().toISOString().split('T')[0],
            amount: parseFloat(paymentAmount),
            voucher_url: publicURLData.publicUrl,
            voucher_filename: fileName,
            validated: false,
          };
          await addPayment(clientData.id, paymentData);
          toast({ title: "Comprobante Subido", description: "Tu comprobante ha sido enviado para validación." });
          setVoucherFile(null);
          setPaymentAmount('');
          onOpenChange(false);
        } catch (error) {
          console.error("Error uploading payment or file:", error);
          toast({ variant: "destructive", title: "Error al subir", description: error.message });
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[480px] glassmorphism border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Subir Comprobante</DialogTitle>
              <DialogDescription className="text-gray-400">
                Sube tu comprobante de pago para que sea validado por un administrador.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadPayment} className="space-y-4 pt-4">
              <div>
                <Label htmlFor="paymentAmountModal" className="text-gray-300">Monto del Pago</Label>
                <Input
                  id="paymentAmountModal"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Ej: 100.00"
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="voucherModal" className="text-gray-300">Archivo del Comprobante (PDF, JPG, PNG)</Label>
                <Input
                  id="voucherModal"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  className="bg-slate-700/50 border-slate-600 text-white file:text-gray-400 file:bg-slate-800 file:border-0 file:hover:bg-slate-700"
                />
                {voucherFile && <p className="text-xs text-gray-400 mt-1">Archivo seleccionado: {voucherFile.name}</p>}
              </div>
              <DialogFooter>
                 <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancelar</Button>
                 <Button type="submit" className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold">Enviar Comprobante</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };
  