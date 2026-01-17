import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useUIStore } from '../stores/uiStore';

export function Toasts() {
  const { toasts, removeToast } = useUIStore();

  // Auto-dismiss toasts
  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 4000);

      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-fade-in',
            'bg-white/10 backdrop-blur-xl border',
            toast.type === 'success' && 'border-success/50',
            toast.type === 'error' && 'border-error/50',
            toast.type === 'info' && 'border-primary/50'
          )}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-success" />}
          {toast.type === 'error' && <XCircle className="h-5 w-5 text-error" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-primary" />}

          <span className="text-sm text-white">{toast.message}</span>

          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 p-1 hover:bg-white/10 rounded"
          >
            <X className="h-4 w-4 text-white/60" />
          </button>
        </div>
      ))}
    </div>
  );
}
