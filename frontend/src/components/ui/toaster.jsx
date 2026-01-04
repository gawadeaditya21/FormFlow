import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const iconMap = {
  default: Info,
  success: CheckCircle,
  destructive: AlertCircle,
  error: AlertCircle,
};

const colorMap = {
  default: 'bg-card border-border',
  success: 'bg-emerald-50 border-emerald-200',
  destructive: 'bg-red-50 border-red-200',
  error: 'bg-red-50 border-red-200',
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.variant] || iconMap.default;
          const colorClass = colorMap[toast.variant] || colorMap.default;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`${colorClass} p-4 rounded-lg border shadow-lg min-w-[300px]`}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                <div className="flex-1">
                  {toast.title && (
                    <div className="font-semibold mb-1">{toast.title}</div>
                  )}
                  {toast.description && (
                    <div className="text-sm text-muted-foreground">
                      {toast.description}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="shrink-0 rounded-full p-1 hover:bg-black/5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
