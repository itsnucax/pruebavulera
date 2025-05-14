
    import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { LogOut, UserCircle, ShieldCheck, Home as HomeIcon, Smartphone } from 'lucide-react';
    import { Toaster } from '@/components/ui/toaster.jsx';
    import { ThemeToggle } from '@/components/ThemeToggle.jsx';
    import { useTheme } from '@/contexts/ThemeContext.jsx';

    const Layout = ({ children }) => {
      const { currentUser, logout } = useAuth();
      const navigate = useNavigate();
      const { theme } = useTheme();

      const handleLogout = () => {
        logout();
        navigate('/');
      };

      return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
          <header className={`py-4 px-6 shadow-lg sticky top-0 z-40 ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}>
            <div className="container mx-auto flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold flex items-center tech-gradient-text">
                <Smartphone className="mr-2 h-7 w-7" /> EasyPhone Contabilidad
              </Link>
              <nav className="flex items-center space-x-4">
                <ThemeToggle />
                {currentUser ? (
                  <>
                    {currentUser.type === 'client' && (
                      <Button variant="ghost" onClick={() => navigate('/client/dashboard')} className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                        <UserCircle className="mr-2 h-5 w-5" /> Mi Panel
                      </Button>
                    )}
                    {currentUser.type === 'admin' && (
                      <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                        <ShieldCheck className="mr-2 h-5 w-5" /> Panel Admin
                      </Button>
                    )}
                    <Button variant="destructive" onClick={handleLogout} size="sm">
                      <LogOut className="mr-2 h-4 w-4" /> Salir
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" onClick={() => navigate('/')} className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                    <HomeIcon className="mr-2 h-5 w-5" /> Inicio
                  </Button>
                )}
              </nav>
            </div>
          </header>
          <main className="flex-grow container mx-auto py-8 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
          <footer className={`py-6 text-center text-sm ${theme === 'dark' ? 'text-gray-500 border-slate-700' : 'text-gray-600 border-gray-300'} border-t`}>
            © {new Date().getFullYear()} EasyPhone Contabilidad. Todos los derechos reservados.
          </footer>
          <Toaster />
        </div>
      );
    };

    export default Layout;
  