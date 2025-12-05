'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastQueue: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
};

function addToast(message: string, type: ToastType) {
  const id = Math.random().toString(36).substring(7);
  toastQueue = [...toastQueue, { id, message, type }];
  listeners.forEach((listener) => listener(toastQueue));
  
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toastQueue));
  }, 5000);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'border-green-500 bg-green-500/10 text-green-500',
    error: 'border-red-500 bg-red-500/10 text-red-500',
    info: 'border-blue-500 bg-blue-500/10 text-blue-500',
  };

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`pointer-events-auto flex items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm ${colors[t.type]}`}
            >
              <Icon className="h-5 w-5" />
              <p className="text-sm font-medium">{t.message}</p>
              <button
                onClick={() => {
                  toastQueue = toastQueue.filter((toast) => toast.id !== t.id);
                  listeners.forEach((listener) => listener(toastQueue));
                }}
                className="ml-4 opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}