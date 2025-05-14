
    import React, { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { UserPlus, ArrowLeft } from 'lucide-react';

    const RegisterPage = () => {
      const navigate = useNavigate();
      const { registerClient, error, setError } = useAuth();
      const { toast } = useToast();

      const [formData, setFormData] = useState({
        client_identifier: '',
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
      });

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
          setError("Las contraseñas no coinciden.");
          toast({ variant: "destructive", title: "Error de registro", description: "Las contraseñas no coinciden." });
          return;
        }

        const { confirmPassword, ...registrationData } = formData;
        const success = await registerClient(registrationData);

        if (success) {
          toast({ title: "Registro exitoso", description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión." });
          navigate('/');
        }
      };

      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] tech-gradient-background p-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-3xl font-semibold text-white flex items-center">
                  <UserPlus className="mr-3 h-7 w-7 text-teal-400" /> Crear Cuenta
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Completa el formulario para registrarte.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="client_identifier" className="text-gray-300">ID de Cliente (Usuario)</Label>
                    <Input id="client_identifier" type="text" value={formData.client_identifier} onChange={handleChange} required className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-teal-500"/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="full_name" className="text-gray-300">Nombre Completo</Label>
                    <Input id="full_name" type="text" value={formData.full_name} onChange={handleChange} required className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-teal-500"/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-gray-300">Correo Electrónico</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-teal-500"/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                    <Input id="password" type="password" value={formData.password} onChange={handleChange} required className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-teal-500"/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Contraseña</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-teal-500"/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-gray-300">Número de Teléfono</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-teal-500"/>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="address" className="text-gray-300">Dirección</Label>
                    <Input id="address" type="text" value={formData.address} onChange={handleChange} required className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-teal-500"/>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-3">
                  <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold">
                    Registrarse
                  </Button>
                  <Button variant="link" onClick={() => navigate('/')} className="text-gray-300 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
                  </Button>
                </CardFooter>
              </form>
              {error && <p className="mt-3 px-6 text-red-400 text-sm">{error}</p>}
            </Card>
          </motion.div>
        </div>
      );
    };

    export default RegisterPage;
  