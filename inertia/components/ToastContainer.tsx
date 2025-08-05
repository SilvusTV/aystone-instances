import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Toast from './Toast';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // Use optional chaining to safely access the flash property
  const { flash = {} } = usePage<PageProps>().props || {};

  // Handle flash messages from Inertia props
  useEffect(() => {
    if (flash) {
      if (flash.success) {
        addToast(flash.success, 'success');
      }
      if (flash.error) {
        addToast(flash.error, 'error');
      }
    }
  }, [flash]);
  
  // Listen for custom toast events
  useEffect(() => {
    const handleToastEvent = (event: CustomEvent) => {
      const { message, type } = event.detail;
      addToast(message, type);
    };

    window.addEventListener('toast', handleToastEvent as EventListener);
    
    return () => {
      window.removeEventListener('toast', handleToastEvent as EventListener);
    };
  }, []);

  // Add a new toast
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  };

  // Remove a toast by id
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Create a function to add toasts programmatically
export const toast = {
  success: (message: string) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'success' },
    });
    window.dispatchEvent(event);
  },
  error: (message: string) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'error' },
    });
    window.dispatchEvent(event);
  },
  info: (message: string) => {
    const event = new CustomEvent('toast', {
      detail: { message, type: 'info' },
    });
    window.dispatchEvent(event);
  },
};

export default ToastContainer;