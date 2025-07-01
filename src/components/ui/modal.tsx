import React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'success' | 'error' | 'info';
}

export function Modal({ isOpen, onClose, title, children, type = 'info' }: ModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-600 bg-green-100 dark:bg-green-900/40 shadow-green-200 dark:shadow-green-900/50';
      case 'error':
        return 'border-red-600 bg-red-100 dark:bg-red-900/40 shadow-red-200 dark:shadow-red-900/50';
      default:
        return 'border-blue-600 bg-blue-100 dark:bg-blue-900/40 shadow-blue-200 dark:shadow-blue-900/50';
    }
  };

  const getTitleStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-900 dark:text-green-100 font-bold';
      case 'error':
        return 'text-red-900 dark:text-red-100 font-bold';
      default:
        return 'text-blue-900 dark:text-blue-100 font-bold';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border-l-4 shadow-2xl ${getTypeStyles()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold flex items-center gap-2 ${getTitleStyles()}`}>
            <span className="text-xl">{getIcon()}</span>
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors bg-gray-100 dark:bg-gray-700 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6 text-gray-800 dark:text-gray-200 font-medium">
          {children}
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
