import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Heart } from 'lucide-react';

export default function Toast() {
  const { toastMessage, toastId, setToastMessage } = useFavorites();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Clear message after animation completes (300ms)
        setTimeout(() => setToastMessage(null), 300);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [toastMessage, toastId, setToastMessage]);

  if (!toastMessage && !isVisible) return null;

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div 
        className={`flex items-center gap-3 px-6 py-3 rounded-full glass border border-brand-500/30 shadow-[0_10px_40px_rgba(168,85,247,0.3)] transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        <Heart size={18} className="text-brand-500 fill-brand-500" />
        <span className="text-white font-medium tracking-wide text-sm">
          {toastMessage}
        </span>
      </div>
    </div>
  );
}
