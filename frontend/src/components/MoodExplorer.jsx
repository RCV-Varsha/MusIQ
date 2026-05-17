import React, { useState } from 'react';
import axios from 'axios';
import { Play, Loader2, Music, Wind, Heart, Zap, Activity, Target, Sun, Smile, Moon, Disc, Map } from 'lucide-react';
import MoodSongs from './MoodSongs';
import PlaylistView from './PlaylistView';

export default function MoodExplorer({ songs, setSongs, emotion, setEmotion }) {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('grid');

  const manualMoods = [
    { name: "Chill", color: "from-blue-600 to-cyan-400", baseColor: "cyan", accent: "text-cyan-400", icon: Wind },
    { name: "Romantic", color: "from-rose-600 to-pink-500", baseColor: "rose", accent: "text-rose-400", icon: Heart },
    { name: "Focus", color: "from-indigo-600 to-violet-500", baseColor: "indigo", accent: "text-indigo-400", icon: Zap },
    { name: "Energetic", color: "from-orange-600 to-red-500", baseColor: "orange", accent: "text-orange-400", icon: Activity },
    { name: "Motivational", color: "from-amber-600 to-yellow-500", baseColor: "amber", accent: "text-amber-400", icon: Target },
    { name: "Party", color: "from-fuchsia-600 to-purple-500", baseColor: "fuchsia", accent: "text-fuchsia-400", icon: Music },
    { name: "Devotional", color: "from-yellow-600 to-orange-400", baseColor: "yellow", accent: "text-yellow-400", icon: Sun },
    { name: "Feel Good", color: "from-emerald-600 to-green-400", baseColor: "emerald", accent: "text-emerald-400", icon: Smile },
    { name: "Late Night", color: "from-violet-800 to-indigo-900", baseColor: "violet", accent: "text-violet-400", icon: Moon },
    { name: "Retro", color: "from-teal-600 to-emerald-500", baseColor: "teal", accent: "text-teal-400", icon: Disc },
    { name: "Travel", color: "from-sky-600 to-blue-500", baseColor: "sky", accent: "text-sky-400", icon: Map },
  ];

  const handleMoodSelect = async (moodName) => {
    // Normalize mood for backend query (kebab-case)
    const normalizedMood = moodName.toLowerCase().trim().replace(/\s+/g, '-');
    setEmotion(normalizedMood);
    setIsLoading(true);
    setView('playlist');
    
    try {
      const response = await axios.get(`http://localhost:3000/songs?mood=${normalizedMood}`);
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
    const activeMood = manualMoods.find(m => m.name.toLowerCase().trim().replace(/\s+/g, '-') === emotion);
    
    return (
      <PlaylistView 
        title={formatMoodTitle(emotion)}
        subtitle="Mood Mix"
        songs={songs}
        isLoading={isLoading}
        onBack={() => setView('grid')}
        color={activeMood?.baseColor || "brand"}
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 pb-20">
        {manualMoods.map((mood) => {
          const normalizedCurrent = mood.name.toLowerCase().trim().replace(/\s+/g, '-');
          const isActive = emotion === normalizedCurrent;
          const Icon = mood.icon || Music;

          return (
            <div 
              key={mood.name}
              onClick={() => handleMoodSelect(mood.name)}
              className={`group relative aspect-square rounded-2xl p-6 md:p-8 cursor-pointer overflow-hidden transition-all duration-500 border border-white/5 flex flex-col justify-between ${
                isActive 
                  ? "bg-white/10 border-white/20 shadow-2xl scale-[1.03]" 
                  : "bg-white/5 hover:bg-white/10 hover:border-white/10 hover:scale-[1.03]"
              }`}
            >
              {/* Rich Vibrant Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-30 group-hover:opacity-50 transition-opacity duration-700`} />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  isActive ? "bg-white text-black shadow-xl" : "bg-white/5 text-white/30 group-hover:bg-white/10 group-hover:text-white"
                }`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-1.5">
                <h3 className={`font-bold text-xl md:text-2xl tracking-tight transition-colors ${isActive ? "text-white" : "text-white/40 group-hover:text-white"}`}>
                  {mood.name}
                </h3>
                {isActive && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Listening</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
