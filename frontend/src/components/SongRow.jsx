import React, { useState, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';

const SongRow = React.memo(({ song, index, isActive, isPlaying, onPlayToggle, queueContext, color = "brand" }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isBursting, setIsBursting] = useState(false);
  
  const favoriteStatus = isFavorite(song);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    
    // Only animate if we are ADDING to favorites
    if (!favoriteStatus) {
      setIsBursting(true);
      // Auto cleanup DOM after animation completes (800ms)
      setTimeout(() => {
        setIsBursting(false);
      }, 800);
    }
    
    toggleFavorite(song);
  };

  return (
    <motion.div 
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onPlayToggle(index, queueContext)}
      className={`group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-colors duration-300 ${
        isActive 
          ? `bg-white/10 shadow-[0_5px_15px_var(--brand-glow-subtle)]` 
          : "bg-transparent border border-transparent row-hover"
      }`}
    >
      {/* Active State Border Indicator */}
      {isActive && (
        <motion.div 
          layoutId="activeSongIndicator"
          className="absolute inset-0 border border-brand-500/30 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1 relative z-10">
        {/* Thumbnail / Action Area */}
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-dark-card overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg">
          <div className={`absolute inset-0 bg-gradient-to-br from-${color}-900/50 to-dark-bg opacity-30`}></div>
          
          {isActive && isPlaying ? (
            <div className="absolute flex items-end gap-[2px] h-4 z-10">
              <div className={`equalizer-bar bg-${color}-400`}></div>
              <div className={`equalizer-bar bg-${color}-400`}></div>
              <div className={`equalizer-bar bg-${color}-400`}></div>
              <div className={`equalizer-bar bg-${color}-400`}></div>
            </div>
          ) : (
            <div className={`absolute z-10 text-white transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              <Play size={18} className="fill-current ml-0.5" />
            </div>
          )}
          
          {/* Number indicator */}
          {!isActive && (
            <span className="absolute z-0 text-white/30 text-xs md:text-sm font-bold group-hover:opacity-0 transition-opacity">
              {index + 1}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0 pr-2">
          <span className={`font-bold text-sm md:text-base transition-colors truncate ${isActive ? `text-${color}-100` : `text-white group-hover:text-${color}-100`}`}>
            {song.title}
          </span>
          <span className="text-white/40 text-xs md:text-sm truncate font-medium">{song.artist}</span>
        </div>
      </div>

      {/* Heart Action */}
      <div className="pr-4 relative flex items-center justify-center">
        <button 
          onClick={handleHeartClick}
          className={`p-2 transition-transform transition-colors duration-500 ${
            favoriteStatus 
              ? `text-brand-500 hover:scale-110 drop-shadow-[0_0_12px_var(--brand-glow)]` 
              : 'text-white/40 hover:text-white hover:scale-110'
          }`}
        >
          <Heart 
            size={18} 
            className={`transition-colors duration-500 ${favoriteStatus ? 'fill-current' : 'fill-transparent'}`} 
          />
        </button>

        {/* Isolated Micro-animation container */}
        {isBursting && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="absolute animate-heart-burst-1"><Heart size={10} className={`fill-brand-500 text-brand-500`} /></div>
            <div className="absolute animate-heart-burst-2"><Heart size={14} className={`fill-brand-400 text-brand-400`} /></div>
            <div className="absolute animate-heart-burst-3"><Heart size={8} className="fill-brand-300 text-brand-300" /></div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// Explicit display name for debugging
SongRow.displayName = 'SongRow';

export default SongRow;
