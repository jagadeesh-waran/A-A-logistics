import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastConfig = {
  success: {
    icon: <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />,
    border: 'border-l-emerald-500 border-emerald-500/30',
    shadow: 'shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.15)]',
  },
  error: {
    icon: <XCircle size={18} className="text-red-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />,
    border: 'border-l-red-500 border-red-500/30',
    shadow: 'shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(239,68,68,0.2)]',
  },
  warning: {
    icon: <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />,
    border: 'border-l-amber-500 border-amber-500/30',
    shadow: 'shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.15)]',
  },
  info: {
    icon: <Info size={18} className="text-cyan-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />,
    border: 'border-l-cyan-500 border-cyan-500/30',
    shadow: 'shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)]',
  },
};

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, removeToast }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = toastConfig[toast.type] || toastConfig.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 200);
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3.5 bg-[#0f121d]/90 backdrop-blur-xl border border-white/10 border-l-4 ${config.border} ${config.shadow} rounded-xl px-4 py-3.5 min-w-[320px] max-w-[400px] transition-all duration-200 ease-out hover:scale-[1.01] ${
        isExiting
          ? 'opacity-0 translate-x-4 scale-95 pointer-events-none'
          : 'animate-slide-in'
      }`}
    >
      {config.icon}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-bold text-white leading-tight tracking-tight">{toast.title}</p>
        )}
        <p className="text-xs text-slate-300 leading-snug mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-slate-400 hover:text-white transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
