
    import React from 'react';
    import { Moon, Sun } from 'lucide-react';
    import { Button } from '@/components/ui/button.jsx';
    import { useTheme } from '@/contexts/ThemeContext.jsx';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu.jsx';

    export function ThemeToggle() {
      const { setTheme } = useTheme();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border-slate-600 hover:bg-slate-700/50 text-gray-300 hover:text-white">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-gray-200">
            <DropdownMenuItem onClick={() => setTheme('light')} className="hover:!bg-slate-700 focus:!bg-slate-700 cursor-pointer">
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className="hover:!bg-slate-700 focus:!bg-slate-700 cursor-pointer">
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')} className="hover:!bg-slate-700 focus:!bg-slate-700 cursor-pointer">
              Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  