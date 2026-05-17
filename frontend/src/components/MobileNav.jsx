import React from 'react';
import { Home, ScanFace, Heart, ListMusic } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav({ activeSection, setActiveSection }) {
  const navItems = [
    { id: 'all-songs', label: 'Home', icon: Home },
    { id: 'now-playing', label: 'Scanner', icon: ScanFace },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-dark-bg/85 backdrop-blur-2xl border-t border-white/5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <nav className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="relative flex flex-col items-center justify-center w-16 h-12"
              >
                {/* Active Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId="mobileNavIndicator"
                    className="absolute inset-0 bg-brand-500/15 rounded-xl border border-brand-500/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Icon */}
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative z-10 ${isActive ? 'text-brand-400 drop-shadow-[0_0_8px_var(--brand-glow)]' : 'text-white/40'}`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                
                {/* Tiny label */}
                <motion.span 
                  animate={{ y: isActive ? 2 : 0 }}
                  className={`text-[9px] mt-1 tracking-wide relative z-10 transition-colors duration-500 ${isActive ? 'text-brand-300 font-medium' : 'text-white/30 font-light'}`}
                >
                  {item.label}
                </motion.span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
