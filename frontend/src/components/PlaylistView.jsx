import React from 'react';
import { ChevronLeft, Music, Play } from 'lucide-react';
import SongRow from './SongRow';
import { usePlayer } from '../context/PlayerContext';

const PlaylistView = ({ 
  title, 
  subtitle, 
  description,
  songs = [], 
  onBack, 
  icon: Icon = Music,
  color = "brand",
  isLoading = false
}) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mb-4" />
        <p className="text-white/40 font-bold uppercase tracking-widest animate-pulse">Loading Playlist...</p>
      </div>
    );
  }

  return (
    <div className="unified-spacing animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Standardized Header section with restrained soft color-wash */}
      <div className="soft-wash-header group">
        {/* Unified Soft-Wash Identity (15-20% Opacity) */}
        <div className={`soft-wash-overlay from-${color}-500 to-transparent`} />
        
        {/* Back Button - Standardized */}
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-5 left-5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-20 group/back flex items-center gap-2 pr-4 border border-white/5"
          >
            <ChevronLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Back</span>
          </button>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 relative z-10 w-full pt-12 md:pt-0">
          {/* Standardized Cover Art */}
          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-${color}-600/30 to-black border border-white/10 shadow-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden`}>
             <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/10 to-transparent opacity-40`} />
             <Icon className="w-14 h-14 md:w-18 md:h-18 text-white relative z-10 drop-shadow-2xl" strokeWidth={1.5} />
          </div>
          
          <div className="flex flex-col gap-1 text-center md:text-left flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
              {subtitle || 'Playlist'}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-none">
              {title}
            </h1>
            <div className="flex flex-col gap-5 mt-4">
              <p className="text-white/60 font-medium text-sm md:text-base max-w-xl leading-relaxed line-clamp-1">
                {description || `${songs.length} tracks • Curated for your current vibe`}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button 
                  onClick={() => playSong(0, songs)}
                  className={`flex items-center gap-3 bg-${color}-500 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-${color}-500/20`}
                >
                  <Play size={18} fill="currentColor" />
                  Play Mix
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="flex flex-col gap-2 pb-20 relative z-10">
        {songs.length > 0 ? (
          songs.map((song, i) => {
            const isActive = currentSong && (currentSong._id === song._id || currentSong.audio === song.audio);
            return (
              <SongRow 
                key={song._id || song.audio || i}
                song={song}
                index={i}
                isActive={isActive}
                isPlaying={isPlaying}
                color={color}
                onPlayToggle={(idx) => {
                  if (isActive) togglePlay();
                  else playSong(idx, songs);
                }}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border-white/5 opacity-50 text-center">
            <Music className="w-16 h-16 text-white/10 mb-6" />
            <p className="text-xl font-semibold text-white/20 tracking-wide uppercase">No songs found in this playlist</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
