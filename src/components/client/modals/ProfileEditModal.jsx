
    import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';

    export const ProfileEditModal = ({ isOpen, onOpenChange, clientData }) => {
      const { currentUser, updateClientProfile } = useAuth();
      const { toast } = useToast();
      const [profileFormData, setProfileFormData] = useState({ phone: '', address: '' });

      useEffect(() => {
        if (clientData) {
          setProfileFormData({
            phone: clientData.phone || '',
            address: clientData.address || '',
          });
        }
      }, [clientData]);
      
      const handleProfileFormChange = (e) => {
        setProfileFormData({ ...profileFormData, [e.target.id]: e.target.value });
      };

      const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!profileFormData.phone || !profileFormData.address) {
          toast({ variant: "destructive", title: "Error", description: "Teléfono y dirección son requeridos." });
          return;
        }
        await updateClientProfile(currentUser.id, profileFormData);
        onOpenChange(false);
      };

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[480px] glassmorphism border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Perfil</DialogTitle>
              <DialogDescription className="text-gray-400">
                Actualiza tu información personal.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProfileUpdate} className="space-y-4 pt-4">
              <div>
                <Label htmlFor="phoneProfile" className="text-gray-300">Número de Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileFormData.phone}
                  onChange={handleProfileFormChange}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="addressProfile" className="text-gray-300">Dirección</Label>
                <Input
                  id="address"
                  type="text"
                  value={profileFormData.address}
                  onChange={handleProfileFormChange}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-blue-500"
                />
              </div>
              <DialogFooter>
                 <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancelar</Button>
                 <Button type="submit" className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };
  