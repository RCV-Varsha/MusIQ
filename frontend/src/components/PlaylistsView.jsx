import React, { useState, useMemo } from 'react';
import { Heart, Clock, Smile, Wind, Moon, Zap, Music } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { usePlayer } from '../context/PlayerContext';
import PlaylistView from './PlaylistView';

export default function PlaylistsView({ allSongs = [] }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { favorites } = useFavorites();
  const { recentlyPlayed } = usePlayer();

  const smartPlaylists = [
    { id: 'favorites', name: 'Favorites', icon: Heart, color: 'from-pink-600 to-rose-400', count: favorites.length },
    { id: 'recently-played', name: 'Recently Played', icon: Clock, color: 'from-blue-600 to-cyan-400', count: recentlyPlayed.length },
    { id: 'happy', name: 'Happy Mix', icon: Smile, color: 'from-yellow-500 to-amber-400', count: allSongs.filter(s => s.detectedMood === 'happy' || s.moods?.includes('happy')).length },
    { id: 'chill', name: 'Chill Mix', icon: Wind, color: 'from-teal-500 to-emerald-400', count: allSongs.filter(s => s.detectedMood === 'chill' || s.moods?.includes('chill') || s.detectedMood === 'calm' || s.moods?.includes('calm')).length },
    { id: 'late-night', name: 'Late Night', icon: Moon, color: 'from-violet-600 to-purple-500', count: allSongs.filter(s => s.detectedMood === 'late night' || s.moods?.includes('late night') || s.moods?.includes('sleepy')).length },
    { id: 'energetic', name: 'Energetic Mix', icon: Zap, color: 'from-orange-500 to-amber-400', count: allSongs.filter(s => s.detectedMood === 'energetic' || s.moods?.includes('energetic') || s.moods?.includes('power')).length },
  ];

  const playlistSongs = useMemo(() => {
    if (!selectedPlaylist) return [];
    if (selectedPlaylist.id === 'favorites') return favorites;
    if (selectedPlaylist.id === 'recently-played') return recentlyPlayed;
    
    // Filter from allSongs for mood mixes
    return allSongs.filter(s => {
      const dbMood = s.detectedMood;
      const dbMoods = s.moods || [];
      const target = selectedPlaylist.id; // e.g., 'late-night'
      
      return dbMood === target || 
             dbMoods.includes(target) ||
             (target === 'chill' && (dbMood === 'calm' || dbMoods.includes('calm')));
    });
  }, [selectedPlaylist, favorites, recentlyPlayed, allSongs]);

  if (selectedPlaylist) {
    const colorMap = {
      'favorites': 'rose',
      'recently-played': 'sky',
      'happy': 'amber',
      'chill': 'emerald',
      'late-night': 'violet',
      'energetic': 'orange'
    };

    return (
      <PlaylistView 
        title={selectedPlaylist.name}
        subtitle="Smart Playlist"
        description={`A dynamic collection of ${playlistSongs.length} tracks generated based on your activity and preferences.`}
        songs={playlistSongs}
        onBack={() => setSelectedPlaylist(null)}
        icon={selectedPlaylist.icon}
        color={colorMap[selectedPlaylist.id] || "brand"}
      />
    );
  }

  return (
    <div className="unified-spacing animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <span className="section-subtitle">Collections</span>
        <h2 className="page-title">Smart Playlists</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {smartPlaylists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => setSelectedPlaylist(playlist)}
            className="group relative flex items-center gap-6 p-6 glass-card hover:scale-[1.02] transition-all duration-300 hover:border-white/10"
          >
            {/* Background Accent - Standardized */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${playlist.color} opacity-5 group-hover:opacity-10 blur-3xl transition-opacity`} />
            
            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${playlist.color} shadow-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500`}>
              <playlist.icon size={36} className="text-white drop-shadow-xl" strokeWidth={1.5} />
            </div>

            <div className="flex flex-col items-start text-left gap-1 z-10">
              <h3 className="text-lg md:text-xl font-bold text-white transition-colors">{playlist.name}</h3>
              <span className="section-subtitle">{playlist.count} Tracks</span>
            </div>
            
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <Music size={16} className="text-white/80" />
               </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
