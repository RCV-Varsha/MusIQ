import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    togglePlay,
    playNext,
    playPrev,
    seek
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    seek(Number(e.target.value));
  };

  const handleVolume = (e) => {
    setVolume(Number(e.target.value));
  };

  // Progress percentage for CSS custom property (used by the range track fill)
  const progressPct = duration ? `${(currentTime / duration) * 100}%` : '0%';
  const volumePct = `${volume * 100}%`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      {/* Top glow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="glass bg-[var(--bg-card)]/90 backdrop-blur-2xl flex items-center px-4 md:px-6 h-20 md:h-24 justify-between gap-4">
        
        {/* Song Info */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1 md:flex-none md:w-1/4">
          {/* Thumbnail */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 flex-shrink-0 flex items-center justify-center overflow-hidden relative box-glow">
            <Music size={16} className="text-white/60 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-semibold truncate text-sm md:text-base leading-tight">{currentSong.title}</span>
            <span className="text-white/50 text-xs truncate">{currentSong.artist}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center flex-1 md:max-w-xl gap-2 px-2">
          <div className="flex items-center gap-3 md:gap-5">
            <button 
              onClick={() => setIsShuffle(!isShuffle)}
              className={`hidden sm:flex p-1.5 rounded-lg transition-all duration-200 ${isShuffle ? 'text-brand-500' : 'text-white/40 hover:text-white'}`}
            >
              <Shuffle size={17} />
            </button>
            
            <button 
              onClick={playPrev} 
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
            >
              <SkipBack size={22} className="fill-current" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-white/10 flex-shrink-0"
            >
              {isPlaying
                ? <Pause size={19} className="fill-current" />
                : <Play size={19} className="fill-current ml-0.5" />
              }
            </button>
            
            <button 
              onClick={playNext} 
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
            >
              <SkipForward size={22} className="fill-current" />
            </button>
            
            <button 
              onClick={() => setIsRepeat(!isRepeat)}
              className={`hidden sm:flex p-1.5 rounded-lg transition-all duration-200 ${isRepeat ? 'text-brand-500' : 'text-white/40 hover:text-white'}`}
            >
              <Repeat size={17} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-white/40 font-medium tabular-nums w-8 text-right shrink-0">
              {formatTime(currentTime)}
            </span>
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={currentTime} 
              onChange={handleSeek}
              style={{ '--progress': progressPct }}
              className="flex-1 h-1 rounded-full"
            />
            <span className="text-[10px] text-white/40 font-medium tabular-nums w-8 shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden lg:flex items-center gap-2.5 w-1/4 justify-end min-w-[130px]">
          <Volume2 size={16} className="text-white/40 shrink-0" />
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01}
            value={volume} 
            onChange={handleVolume}
            style={{ '--progress': volumePct }}
            className="w-24 h-1 rounded-full"
          />
        </div>

      </div>
    </div>
  );
}
