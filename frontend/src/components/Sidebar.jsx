import React from 'react';
import { Home, Search, Library, Radio, Heart, Settings } from 'lucide-react';

export default function Sidebar({ activeSection, setActiveSection }) {
  const navItems = [
    { id: 'now-playing', name: 'Now Playing', icon: Radio },
    { id: 'all-songs', name: 'All Songs', icon: Home },
    { id: 'playlists', name: 'Playlists', icon: Library },
    { id: 'moods', name: 'Moods', icon: Search },
    { id: 'favorites', name: 'Favorites', icon: Heart },
  ];

  return (
    <div className="w-64 h-full glass rounded-none border-t-0 border-l-0 border-b-0 flex flex-col z-40 bg-dark-card/95 backdrop-blur-xl shadow-2xl">
      
      {/* Logo - Recognizable but Stable */}
      <div className="p-8 pb-10">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Mus<span className="text-brand-500">IQ</span>
        </h1>
      </div>

      {/* Navigation - Standardized */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
          <button 
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-brand-500/10 text-white border border-brand-500/20' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={20} className={isActive ? 'text-brand-500' : ''} />
            <span className="font-bold text-sm">{item.name}</span>
          </button>
        )})}
      </nav>

      {/* Bottom Action - Standardized */}
      <div className="p-4 mb-24 border-t border-white/5 pt-6">
        <button 
          onClick={() => setActiveSection('settings')}
          className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 ${
            activeSection === 'settings' 
              ? 'bg-brand-500/10 text-white border border-brand-500/20' 
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings size={20} className={activeSection === 'settings' ? 'text-brand-500' : ''} />
          <span className="font-bold text-sm">Settings</span>
        </button>
      </div>

    </div>
  );
}
