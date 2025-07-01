'use client';

import Link from 'next/link';
import { Sparkles, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MTG Manager
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
              Sistema completo para gerenciamento de coleção de Magic: The Gathering. 
              Organize suas cartas, construa decks e acompanhe o meta.
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Feito com</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>para a comunidade MTG</span>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Funcionalidades
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collection" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Minha Coleção
                </Link>
              </li>
              <li>
                <Link href="/decks" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Meus Decks
                </Link>
              </li>
              <li>
                <Link href="/cards/search" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Buscar Cartas
                </Link>
              </li>
              <li>
                <Link href="/meta" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Meta Decks
                </Link>
              </li>
              <li>
                <Link href="/prices" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Preços
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Recursos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://scryfall.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Base Scryfall
                </a>
              </li>
              <li>
                <a 
                  href="https://magic.wizards.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Magic: The Gathering
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <Github className="h-4 w-4" />
                  Código Fonte
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © 2024 MTG Manager. Este projeto não é afiliado à Wizards of the Coast.
          </p>
          <p className="mt-2 md:mt-0">
            Magic: The Gathering é uma marca registrada da Wizards of the Coast.
          </p>
        </div>
      </div>
    </footer>
  );
}
