'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Home, 
  BookOpen, 
  Layers, 
  BarChart3, 
  Search,
  Sparkles,
  ChevronDown,
  UserCircle
} from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <nav 
      className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            aria-label="MTG Manager - Ir para página inicial"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              MTG Manager
            </span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="menu"
                  aria-label="Menu do usuário"
                >
                  <UserCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user?.name || 'Admin Teste'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2"
                    role="menu"
                    aria-labelledby="user-menu-button"
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                      role="menuitem"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                      Dashboard
                    </Link>
                    <Link
                      href="/collection"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                      role="menuitem"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                      Coleção
                    </Link>
                    <Link
                      href="/decks"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                      role="menuitem"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Layers className="h-4 w-4 mr-2" aria-hidden="true" />
                      Decks
                    </Link>
                    <Link
                      href="/cards/search"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                      role="menuitem"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                      Buscar Cartas
                    </Link>
                    <Link
                      href="/prices"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                      role="menuitem"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
                      Preços
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" role="separator"></div>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Fazer login"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm"
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Criar nova conta"
                  >
                    Registrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
