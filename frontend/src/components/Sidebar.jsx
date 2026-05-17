import React from 'react';
import { Home, Search, Library, Radio, Heart, Settings, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ activeSection, setActiveSection }) {
  const navItems = [
    { id: 'now-playing', name: 'Now Playing', icon: Radio },
    { id: 'all-songs', name: 'All Songs', icon: Home },
    { id: 'playlists', name: 'Playlists', icon: Library },
    { id: 'moods', name: 'Moods', icon: Search },
    { id: 'favorites', name: 'Favorites', icon: Heart },
  ];

  return (
    <div className="w-64 h-full glass rounded-none border-t-0 border-l-0 border-b-0 flex flex-col z-40 bg-[var(--bg-card)]/60 backdrop-blur-3xl shadow-2xl border-white/5">
      
      {/* Brand Identity - Pure UI-Integrated Typography */}
      <div className="pl-8 pt-10 pb-10 flex flex-col select-none group cursor-pointer relative justify-center">
        {/* Barely-there atmospheric integration */}
        <div className="absolute left-8 top-12 w-20 h-4 bg-brand-500/5 blur-[40px] pointer-events-none transition-opacity duration-700 group-hover:bg-brand-500/10" />
        
        {/* Typography - Pure, calm, and naturally embedded */}
        <h2 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-100 to-brand-500 text-glow leading-none">
          MusIQ
        </h2>
        
        {/* Studio Signature */}
        <span className="text-[9px] font-light tracking-[0.25em] text-brand-100/40 mt-1.5 uppercase transition-opacity duration-700 group-hover:text-brand-100/70">
          Crafted by RCV
        </span>
      </div>

      {/* Navigation - Standardized */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
          <motion.button 
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-brand-500/10 text-white' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            {isActive && (
              <motion.div 
                layoutId="activeNavBorder"
                className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-500 rounded-r-full"
                style={{ boxShadow: '0 0 10px var(--brand-glow), 0 0 20px var(--brand-glow-subtle)' }}
              />
            )}
            <item.icon size={20} className={isActive ? 'text-brand-500 drop-shadow-[0_0_8px_var(--brand-glow)]' : ''} />
            <span className="font-bold text-sm tracking-wide">{item.name}</span>
          </motion.button>
        )})}
      </nav>

      {/* Bottom Action & Branding */}
      <div className="p-4 mb-24 border-t border-white/5 pt-6 flex flex-col gap-6">
        <motion.button 
          onClick={() => setActiveSection('settings')}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
            activeSection === 'settings' 
              ? 'bg-brand-500/10 text-white' 
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          {activeSection === 'settings' && (
            <motion.div 
              layoutId="activeNavBorder"
              className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-500 rounded-r-full"
              style={{ boxShadow: '0 0 10px var(--brand-glow), 0 0 20px var(--brand-glow-subtle)' }}
            />
          )}
          <Settings size={20} className={activeSection === 'settings' ? 'text-brand-500 drop-shadow-[0_0_8px_var(--brand-glow)]' : ''} />
          <span className="font-bold text-sm tracking-wide">Settings</span>
        </motion.button>
      </div>

    </div>
  );
}
