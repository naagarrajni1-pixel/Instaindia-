import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#121212]/95 border border-white/20 text-white shadow-2xl backdrop-blur-md text-sm font-medium tracking-wide">
        <Sparkles className="w-4 h-4 text-white/80 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
