import React from 'react';
import { Music } from 'lucide-react';
import SongRow from './SongRow';
import { usePlayer } from '../context/PlayerContext';
import PlaylistHeader from './PlaylistHeader';

const PlaylistView = ({ 
  title, 
  subtitle, 
  description,
  songs = [], 
  onBack, 
  icon: Icon = Music,
  color = "brand",
  mood = "",
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
      
      <PlaylistHeader 
        title={title}
        subtitle={subtitle}
        description={description}
        mood={mood || (title === 'Your Favorites' ? 'favorites' : title)}
        icon={Icon}
        onPlay={() => playSong(0, songs)}
        onBack={onBack}
        songCount={songs.length}
      />

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
