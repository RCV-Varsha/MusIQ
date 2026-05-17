import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { Camera, AlertTriangle, Loader2, CheckCircle } from "lucide-react";

export default function FacialExpression({ setSongs, setEmotion, emotion, setActiveSection }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Initializing models...");
  const [isDetecting, setIsDetecting] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [error, setError] = useState(null);
  
  const lastEmotions = useRef([]);
  const detectionInterval = useRef(null);

  // Load face-api models on mount
  useEffect(() => {
    const videoElement = videoRef.current;
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models"; 
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setStatus("Ready to scan");
      } catch (err) {
        console.error("Model load error:", err);
        setError("Failed to load AI models. Please refresh.");
      }
    };

    loadModels();
    
    return () => {
      stopAll(videoElement);
    };
  }, []);

  const stopAll = (videoEl = videoRef.current) => {
    setIsDetecting(false);
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    if (videoEl?.srcObject) {
      videoEl.srcObject.getTracks().forEach(track => track.stop());
      videoEl.srcObject = null;
    }
  };

  const startScan = async () => {
    if (error) return;
    
    // Reset state for new scan
    setScanComplete(false);
    setIsDetecting(true);
    setStatus("Activating camera...");
    lastEmotions.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current.play();
          setStatus("Scanning face...");
          beginDetectionLoop();
        };
      }
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
      setIsDetecting(false);
    }
  };

  const beginDetectionLoop = () => {
    // Run detection every 1 second to find a stable mood quickly within a 3-5s window
    detectionInterval.current = setInterval(async () => {
      if (document.hidden || !videoRef.current) return;
      
      try {
        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections) {
          const expressions = detections.expressions;
          const dominantEmotion = Object.keys(expressions).reduce((a, b) => 
            expressions[a] > expressions[b] ? a : b
          );
          const confidence = expressions[dominantEmotion];

          const allowedEmotions = ['happy', 'sad', 'neutral', 'surprised'];
          if (confidence > 0.6 && allowedEmotions.includes(dominantEmotion)) {
             let finalMood = dominantEmotion;
             if (finalMood === 'neutral' && confidence > 0.8) {
                 finalMood = 'calm';
             }
             handleStabilizedMood(finalMood);
          }
        }
      } catch (err) {
        console.error("Detection error", err);
      }
    }, 1000);
  };

  const handleStabilizedMood = (newEmotion) => {
    lastEmotions.current.push(newEmotion);
    if (lastEmotions.current.length > 3) {
      lastEmotions.current.shift();
    }
    
    // Require 2 consecutive identical detections
    const isStable = lastEmotions.current.length >= 2 && 
                     lastEmotions.current[lastEmotions.current.length - 1] === lastEmotions.current[lastEmotions.current.length - 2];
                     
    if (isStable) {
      finalizeScan(newEmotion);
    }
  };

  const finalizeScan = (detectedMood) => {
    stopAll(); // Shuts off camera and intervals
    setScanComplete(true);
    setStatus(`Scan Complete`);
    
    if (detectedMood !== emotion) {
      setEmotion(detectedMood);
    }
  };

  const fetchSongs = async (mood) => {
    try {
      axios.post("http://localhost:3000/emotion", { emotion: mood }).catch(console.error);
      const response = await axios.get(`http://localhost:3000/songs?mood=${mood}`);
      if (response.data && response.data.songs) {
        setSongs(response.data.songs);
      }
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 glass rounded-2xl border-red-500/20 text-center h-[300px] w-full max-w-md">
        <AlertTriangle className="w-12 h-12 text-red-500/80 mb-4" />
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p className="text-white/60 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-md gap-4">
      
      {/* Camera / Status Card */}
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden glass transition-all duration-500 ${isDetecting ? 'live-glow-border' : 'border-white/10'}`}>
        
        {/* Scanning Corners Animation */}
        {isDetecting && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-500 m-4 animate-scan" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-500 m-4 animate-scan" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-500 m-4 animate-scan" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-500 m-4 animate-scan" />
          </div>
        )}

        {/* Live Indicator */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
          {isDetecting ? (
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Scanning</span>
             </div>
          ) : scanComplete ? (
             <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-green-400">Complete</span>
             </div>
          ) : (
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/40" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Standby</span>
             </div>
          )}
        </div>

        {/* Status Text */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-100">
            {status}
          </span>
        </div>

        {/* Video Feed or Placeholder */}
        <video
          ref={videoRef}
          autoPlay
          muted
          className={`w-full h-full object-cover transform scale-x-[-1] brightness-125 contrast-110 transition-opacity duration-700 ${isDetecting ? 'opacity-100' : 'opacity-0 hidden'}`}
        />
        
        {/* Success / Idle State Overlay */}
        {!isDetecting && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-dark-card/60 backdrop-blur-sm">
             {status === "Initializing models..." ? (
                <>
                  <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
                  <span className="text-sm font-medium text-white/60 uppercase tracking-widest animate-pulse">Loading AI Core</span>
                </>
             ) : scanComplete ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-4 box-glow">
                     <span className="text-3xl">✨</span>
                  </div>
                  <span className="text-xl font-bold text-white text-glow mb-1">You seem {emotion} today ✨</span>
                  <span className="text-xs font-medium text-white/50 uppercase tracking-widest mt-1 mb-6">AI Detected Mood</span>
                  
                  <div className="flex flex-col gap-3 w-full max-w-[200px]">
                    <button 
                      onClick={() => fetchSongs(emotion)}
                      className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 rounded-lg text-white text-sm font-bold tracking-wider uppercase hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    >
                      Play Recommended
                    </button>
                    <button 
                      onClick={() => setActiveSection('moods')}
                      className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm font-bold tracking-wider uppercase hover:bg-white/10 hover:text-white transition-all"
                    >
                      Choose Another
                    </button>
                  </div>
                </>
             ) : (
                <>
                  <Camera className="w-12 h-12 text-white/20 mb-4" />
                  <span className="text-sm font-medium text-white/40 uppercase tracking-widest">Camera Offline</span>
                </>
             )}
          </div>
        )}
      </div>

      {/* Action Button */}
      {!scanComplete && (
        <button 
          onClick={startScan}
          disabled={status === "Initializing models..." || error || isDetecting}
          className={`w-full py-4 rounded-xl font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 ${
            isDetecting 
              ? 'bg-white/5 border border-brand-500/30 text-brand-500 cursor-wait'
              : 'bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02]'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {!isDetecting && <Camera size={20} />}
          {isDetecting ? 'Scanning Face...' : 'Scan Mood'}
        </button>
      )}
      
      {scanComplete && (
        <button 
          onClick={startScan}
          className="w-full py-3 rounded-xl font-bold tracking-wider uppercase text-white/50 text-sm hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Camera size={16} />
          Rescan Face
        </button>
      )}

    </div>
  );
}
