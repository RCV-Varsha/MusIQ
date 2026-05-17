import React, { useState } from 'react';
import axios from 'axios';
import { Play, Loader2, Music, Wind, Heart, Zap, Activity, Target, Sun, Smile, Moon, Disc, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { explorerMoods } from '../config/moodThemes';
import MoodSongs from './MoodSongs';
import PlaylistView from './PlaylistView';

export default function MoodExplorer({ songs, setSongs, emotion, setEmotion }) {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('grid');



  const handleMoodSelect = async (moodName) => {
    // Normalize mood for backend query (kebab-case)
    const normalizedMood = moodName.toLowerCase().trim().replace(/\s+/g, '-');
    setEmotion(normalizedMood);
    setIsLoading(true);
    setView('playlist');
    
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      const response = await axios.get(`${API_BASE}/songs?mood=${normalizedMood}`);
      if (response.data && response.data.songs) {
        setSongs(response.data.songs);
      }
    } catch (err) {
      console.error("Mood Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMoodTitle = (text) => {
    return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (view === 'playlist') {
    
    return (
      <PlaylistView 
        title={formatMoodTitle(emotion)}
        subtitle="Mood Mix"
        songs={songs}
        isLoading={isLoading}
        onBack={() => setView('grid')}
      />
    );
  }

  return (
    <div className="unified-spacing animate-in fade-in duration-1000">
      {/* Standardized Header */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Discovery</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Mood Explorer</h2>
      </div>

      {/* Mood Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
        {explorerMoods.map((mood) => {
          const normalizedCurrent = mood.name.toLowerCase().trim().replace(/\s+/g, '-');
          const isActive = emotion === normalizedCurrent;
          const Icon = mood.icon || Music;

          return (
            <motion.div 
              key={mood.name}
              onClick={() => handleMoodSelect(mood.name)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative h-20 md:h-24 rounded-[2.5rem] px-5 md:px-6 cursor-pointer overflow-hidden transition-colors duration-500 border flex items-center gap-4 ${
                isActive 
                  ? "bg-white/10 border-white/20 shadow-[0_10px_30px_var(--brand-glow-subtle)]" 
                  : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 hover:shadow-2xl"
              }`}
            >
              {/* Rich Vibrant Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-40 group-hover:opacity-70 transition-opacity duration-700`} />
              
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-md ${
                  isActive ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white"
                }`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </div>

              <div className="relative z-10 flex flex-col flex-1 min-w-0">
                <h3 className={`font-bold text-lg md:text-xl tracking-tight transition-colors truncate ${isActive ? "text-white drop-shadow-md" : "text-white/60 group-hover:text-white"}`}>
                  {mood.name}
                </h3>
                {isActive && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_5px_white]" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">Listening</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
