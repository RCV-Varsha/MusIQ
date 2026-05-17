import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Play, Camera, Monitor, Info, Save, RotateCcw } from 'lucide-react';

export default function SettingsView() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('musiq_settings');
    return saved ? JSON.parse(saved) : {
      playback: {
        autoplayNext: true,
        volumeMemory: true,
      },
      camera: {
        autoStop: true,
        sensitivity: 70,
      },
      appearance: {
        darkMode: true,
        accentColor: '#A855F7', // brand-500
      }
    };
  });

  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    localStorage.setItem('musiq_settings', JSON.stringify(settings));
    setSavedStatus(true);
    const timer = setTimeout(() => setSavedStatus(false), 2000);
    
    // Apply Appearance immediately
    const root = document.documentElement;
    if (settings.appearance.darkMode) {
      root.setAttribute('data-theme', 'deep-black');
    } else {
      root.removeAttribute('data-theme');
    }
    
    const accentMap = {
      '#A855F7': 'purple',
      '#EC4899': 'pink',
      '#06B6D4': 'cyan',
      '#22C55E': 'green'
    };
    const accentKey = accentMap[settings.appearance.accentColor] || 'purple';
    root.setAttribute('data-accent', accentKey);

    return () => clearTimeout(timer);
  }, [settings]);

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div className="glass rounded-3xl p-8 border-white/5 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
          <Icon size={20} />
        </div>
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between group">
      <div className="flex flex-col gap-1">
        <span className="font-bold text-white/90 group-hover:text-white transition-colors">{label}</span>
        <span className="text-sm text-white/40">{description}</span>
      </div>
      <button 
        onClick={() => onChange(!value)}
        className={`w-14 h-7 rounded-full relative transition-all duration-300 ${value ? 'bg-brand-500' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 ${value ? 'left-8' : 'left-1'} shadow-lg`} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 w-full max-w-4xl animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-100 to-brand-500 text-glow">
            App Settings
          </h2>
          <p className="text-white/60 font-medium">Configure MusIQ to match your preferences.</p>
        </div>
        {savedStatus && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full animate-in zoom-in duration-300">
            <Save size={14} className="text-green-500" />
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Changes Saved</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section icon={Play} title="Playback">
          <Toggle 
            label="Autoplay Next" 
            description="Automatically play the next track in queue"
            value={settings.playback.autoplayNext}
            onChange={(v) => updateSetting('playback', 'autoplayNext', v)}
          />
          <Toggle 
            label="Volume Memory" 
            description="Remember volume level between sessions"
            value={settings.playback.volumeMemory}
            onChange={(v) => updateSetting('playback', 'volumeMemory', v)}
          />
        </Section>

        <Section icon={Camera} title="Camera & AI">
          <Toggle 
            label="Auto-stop Detection" 
            description="Turn off camera once mood is stabilized"
            value={settings.camera.autoStop}
            onChange={(v) => updateSetting('camera', 'autoStop', v)}
          />
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center">
                <span className="font-bold text-white/90">Scan Sensitivity</span>
                <span className="text-xs font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded">{settings.camera.sensitivity}%</span>
             </div>
             <input 
               type="range"
               min="1"
               max="100"
               value={settings.camera.sensitivity}
               onChange={(e) => updateSetting('camera', 'sensitivity', parseInt(e.target.value))}
               className="w-full accent-brand-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
             />
             <span className="text-[10px] text-white/30 uppercase tracking-widest">Higher values mean faster (but potentially less accurate) mood stabilization</span>
          </div>
        </Section>

        <Section icon={Monitor} title="Appearance">
          <Toggle 
            label="Deep Dark Mode" 
            description="Use true black backgrounds for OLED screens"
            value={settings.appearance.darkMode}
            onChange={(v) => updateSetting('appearance', 'darkMode', v)}
          />
          <div className="flex flex-col gap-3">
             <span className="font-bold text-white/90">Choose Your Accent</span>
             <div className="flex gap-4">
                {[
                  { name: 'Purple', hex: '#A855F7' },
                  { name: 'Pink', hex: '#EC4899' },
                  { name: 'Cyan', hex: '#06B6D4' },
                  { name: 'Green', hex: '#22C55E' }
                ].map(color => (
                  <button 
                    key={color.hex}
                    onClick={() => updateSetting('appearance', 'accentColor', color.hex)}
                    title={color.name}
                    className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 hover:scale-110 active:scale-95 ${settings.appearance.accentColor === color.hex ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
             </div>
          </div>
        </Section>

        <Section icon={Info} title="About MusIQ">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40">Version</span>
              <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">1.0.4-stable</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40">Engine</span>
              <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">FaceAPI.js / ImageKit</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mt-2 italic">
              "MusIQ is a modern mood-driven music player that uses computer vision to synchronize your vibe with your library."
            </p>
            <button className="flex items-center gap-2 text-brand-500 text-xs font-bold uppercase tracking-widest mt-2 hover:opacity-80 transition-opacity">
               <RotateCcw size={14} />
               Reset All Settings
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
