import { Wind, Heart, Zap, Activity, Target, Music, Sun, Smile, Moon, Disc, Map } from 'lucide-react';

export const moodThemes = {
  happy: {
    name: "Happy",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    buttonGlow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
    buttonBg: "bg-amber-500 text-white",
    icon: Smile,
  },
  chill: {
    name: "Chill",
    gradient: "from-teal-500 to-cyan-600",
    buttonGlow: "shadow-[0_0_20px_rgba(20,184,166,0.4)]",
    buttonBg: "bg-teal-500 text-white",
    icon: Wind,
  },
  calm: {
    name: "Calm",
    gradient: "from-teal-500 to-cyan-600",
    buttonGlow: "shadow-[0_0_20px_rgba(20,184,166,0.4)]",
    buttonBg: "bg-teal-500 text-white",
    icon: Wind,
  },
  'late-night': {
    name: "Late Night",
    gradient: "from-violet-900 via-indigo-900 to-black",
    buttonGlow: "shadow-[0_0_20px_rgba(88,28,135,0.4)]",
    buttonBg: "bg-violet-600 text-white",
    icon: Moon,
  },
  energetic: {
    name: "Energetic",
    gradient: "from-orange-600 to-pink-600",
    buttonGlow: "shadow-[0_0_20px_rgba(234,88,12,0.4)]",
    buttonBg: "bg-orange-500 text-white",
    icon: Activity,
  },
  romantic: {
    name: "Romantic",
    gradient: "from-pink-500 to-rose-400",
    buttonGlow: "shadow-[0_0_20px_rgba(236,72,153,0.4)]",
    buttonBg: "bg-pink-500 text-white",
    icon: Heart,
  },
  focus: {
    name: "Focus",
    gradient: "from-slate-800 to-cyan-900",
    buttonGlow: "shadow-[0_0_20px_rgba(22,78,99,0.4)]",
    buttonBg: "bg-cyan-700 text-white",
    icon: Zap,
  },
  favorites: {
    name: "Favorites",
    gradient: "from-purple-600 to-brand-900",
    buttonGlow: "shadow-[0_0_20px_var(--brand-glow)]",
    buttonBg: "bg-brand-500 text-white",
    icon: Heart,
  },
  motivational: {
    name: "Motivational",
    gradient: "from-orange-500 to-red-500",
    buttonGlow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    buttonBg: "bg-red-500 text-white",
    icon: Target,
  },
  party: {
    name: "Party",
    gradient: "from-fuchsia-600 to-purple-600",
    buttonGlow: "shadow-[0_0_20px_rgba(192,38,211,0.4)]",
    buttonBg: "bg-fuchsia-500 text-white",
    icon: Music,
  },
  devotional: {
    name: "Devotional",
    gradient: "from-yellow-600 to-orange-500",
    buttonGlow: "shadow-[0_0_20px_rgba(234,179,8,0.4)]",
    buttonBg: "bg-yellow-500 text-white",
    icon: Sun,
  },
  'feel-good': {
    name: "Feel Good",
    gradient: "from-emerald-500 to-teal-500",
    buttonGlow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    buttonBg: "bg-emerald-500 text-white",
    icon: Smile,
  },
  retro: {
    name: "Retro",
    gradient: "from-rose-500 to-orange-500",
    buttonGlow: "shadow-[0_0_20px_rgba(244,63,94,0.4)]",
    buttonBg: "bg-rose-500 text-white",
    icon: Disc,
  },
  travel: {
    name: "Travel",
    gradient: "from-sky-500 to-blue-600",
    buttonGlow: "shadow-[0_0_20px_rgba(14,165,233,0.4)]",
    buttonBg: "bg-sky-500 text-white",
    icon: Map,
  },
  sad: {
    name: "Sad",
    gradient: "from-indigo-900 via-blue-900 to-black",
    buttonGlow: "shadow-[0_0_20px_rgba(67,56,202,0.4)]",
    buttonBg: "bg-indigo-600 text-white",
    icon: Wind,
  },
  default: {
    name: "Playlist",
    gradient: "from-brand-600 to-dark-bg",
    buttonGlow: "shadow-[0_0_20px_var(--brand-glow)]",
    buttonBg: "bg-brand-500 text-white",
    icon: Music,
  }
};

export const getMoodTheme = (moodString) => {
  if (!moodString) return moodThemes.default;
  const normalized = moodString.toLowerCase().trim().replace(/\s+/g, '-');
  return moodThemes[normalized] || moodThemes.default;
};

// Helper for MoodExplorer grid
export const explorerMoods = [
  'chill', 'romantic', 'focus', 'energetic', 'motivational', 
  'party', 'devotional', 'feel-good', 'late-night', 'retro', 'travel'
].map(key => ({ id: key, ...moodThemes[key] }));
