import React, { useEffect } from "react";
import { Music, AlertCircle } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import SongRow from "./SongRow";

const MoodSongs = React.memo(({ songs, emotion }) => {
  const { currentSong, currentSongIndex, isPlaying, playSong, togglePlay, setQueue } = usePlayer();

  // Sync songs list to player queue
  useEffect(() => {
    if (songs && songs.length > 0) {
      setQueue(songs);
    }
  }, [songs, setQueue]);

  if (!emotion) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass rounded-2xl border-white/5 text-center h-[300px]">
        <Music className="w-12 h-12 text-white/20 mb-4" />
        <p className="text-white/60 font-medium text-lg">Waiting for mood detection...</p>
      </div>
    );
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 glass rounded-3xl border-white/5 text-center h-[400px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-50" />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center mb-6 mx-auto box-glow">
            <Music className="w-10 h-10 text-brand-500/50" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No songs added for this vibe yet ✨</h3>
          <p className="text-white/40 font-medium max-w-xs mx-auto">
            Try scanning your face or uploading new tracks to categorize them as <span className="text-brand-500 capitalize">{emotion.replace(/-/g, ' ')}</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h3 className="text-2xl font-bold tracking-tight">
          Playlist for <span className="text-brand-500 capitalize">{emotion.replace(/-/g, ' ')}</span>
        </h3>
        <div className="px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-100 text-xs font-semibold uppercase tracking-wider">
          {songs.length} Tracks
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {songs.map((song, i) => {
          // Robust active check matching user constraints
          const isActive = currentSong && 
            ((currentSong._id && song._id && currentSong._id === song._id) || 
             (currentSong.audio === song.audio));
          
          return (
            <SongRow 
              key={song._id || song.audio || i}
              song={song}
              index={i}
              isActive={isActive}
              isPlaying={isPlaying}
              onPlayToggle={(idx, q) => {
                if (isActive) togglePlay();
                else playSong(idx, q);
              }}
              queueContext={songs}
            />
          );
        })}
      </div>
    </div>
  );
});

MoodSongs.displayName = 'MoodSongs';

export default MoodSongs;