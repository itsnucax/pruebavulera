
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button.jsx';
    import { Input } from '@/components/ui/input.jsx';
    import { Label } from '@/components/ui/label.jsx';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Smartphone, User, Lock, Shield } from 'lucide-react';
    import { useTheme } from '@/contexts/ThemeContext.jsx';

    const HomePage = () => {
      const navigate = useNavigate();
      const { loginClient, loginAdmin, error, setError, currentUser } = useAuth();
      const { toast } = useToast();
      const { theme } = useTheme();

      const [clientId, setClientId] = useState('');
      const [clientPassword, setClientPassword] = useState('');
      const [adminPassword, setAdminPassword] = useState('');
      const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

      if (currentUser) {
        if (currentUser.type === 'client') navigate('/client/dashboard');
        if (currentUser.type === 'admin') navigate('/admin/dashboard');
        return null; 
      }

      const handleClientLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (loginClient(clientId, clientPassword)) {
          toast({ title: "Inicio de sesión exitoso", description: "Bienvenido a tu panel." });
          navigate('/client/dashboard');
        } else {
          toast({ variant: "destructive", title: "Error de inicio de sesión", description: error || "ID de cliente o contraseña incorrectos." });
        }
      };

      const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (loginAdmin(adminPassword)) {
          toast({ title: "Acceso de administrador concedido", description: "Bienvenido al panel de administración." });
          setIsAdminDialogOpen(false);
          navigate('/admin/dashboard');
        } else {
          toast({ variant: "destructive", title: "Error de acceso", description: error || "Contraseña de administrador incorrecta." });
        }
      };
      
      return (
        <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4 ${theme === 'dark' ? 'tech-gradient-background' : 'bg-gray-50'}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Smartphone className={`mx-auto h-24 w-24 mb-4 ${theme === 'dark' ? 'tech-gradient-text' : 'text-blue-600'}`} />
            <h1 className={`text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              EasyPhone <span className={`${theme === 'dark' ? 'tech-gradient-text' : 'text-blue-600'}`}>Contabilidad</span>
            </h1>
            <p className={`mt-6 max-w-2xl text-lg sm:text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Gestiona tus planes de financiamiento de forma fácil y segura. Accede a tu información en cualquier momento y lugar.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className={`${theme === 'dark' ? 'glassmorphism' : 'bg-white shadow-xl'}`}>
                <CardHeader>
                  <CardTitle className={`text-3xl font-semibold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <User className={`mr-3 h-7 w-7 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} /> Acceso Clientes
                  </CardTitle>
                  <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ingresa con tu ID de cliente y contraseña.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleClientLogin}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="clientId" className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>ID de Cliente</Label>
                      <Input 
                        id="clientId" 
                        type="text" 
                        placeholder="Tu ID de cliente" 
                        value={clientId} 
                        onChange={(e) => setClientId(e.target.value)} 
                        required 
                        className={`${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientPassword" className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Contraseña</Label>
                      <Input 
                        id="clientPassword" 
                        type="password" 
                        placeholder="Tu contraseña" 
                        value={clientPassword} 
                        onChange={(e) => setClientPassword(e.target.value)} 
                        required 
                        className={`${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'}`}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className={`w-full font-semibold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                      Ingresar
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className={`${theme === 'dark' ? 'glassmorphism' : 'bg-white shadow-xl'}`}>
                <CardHeader>
                  <CardTitle className={`text-3xl font-semibold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <Shield className={`mr-3 h-7 w-7 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} /> Área Administrativa
                  </CardTitle>
                  <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Acceso exclusivo para administradores.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
                    Si eres administrador, haz clic aquí para ingresar tu contraseña y acceder al panel de gestión.
                  </p>
                </CardContent>
                <CardFooter>
                  <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className={`w-full font-semibold ${theme === 'dark' ? 'border-green-500 text-green-400 hover:bg-green-500/20 hover:text-green-300' : 'border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700'}`}>
                        Acceder como Administrador
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={`sm:max-w-[425px] ${theme === 'dark' ? 'glassmorphism border-slate-700' : 'bg-white border-gray-300'}`}>
                      <DialogHeader>
                        <DialogTitle className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Acceso Administrador</DialogTitle>
                        <DialogDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Ingresa la contraseña de administrador.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAdminLogin}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="adminPass" className={`text-right ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Contraseña
                            </Label>
                            <Input
                              id="adminPass"
                              type="password"
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              className={`col-span-3 ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-500 focus:ring-green-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-green-500'}`}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className={`font-semibold ${theme === 'dark' ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                            Confirmar
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
          {error && <p className={`mt-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>}
        </div>
      );
    };

    export default HomePage;
  