import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  Check,
  Disc,
} from 'lucide-react';

export const ReelsFeed: React.FC = () => {
  const {
    reels,
    toggleLikeReel,
    toggleSaveReel,
    toggleFollow,
    setActiveCommentPostId,
    setActiveSharePost,
    posts,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may need user gesture; mute helps
        setIsMuted(true);
      });
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleOpenComments = () => {
    // Open comments for the first related post or general
    if (posts.length > 0) {
      setActiveCommentPostId(posts[0].id);
    }
  };

  const handleOpenShare = () => {
    if (posts.length > 0) {
      setActiveSharePost(posts[0]);
    }
  };

  if (!currentReel) return null;

  return (
    <div className="relative w-full max-w-sm md:max-w-md mx-auto h-[calc(100vh-8rem)] md:h-[84vh] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center my-2 select-none">
      {/* Video Container */}
      <div
        className="relative w-full h-full cursor-pointer flex items-center justify-center bg-[#0d0d0d]"
        onClick={togglePlayPause}
      >
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          poster={currentReel.posterUrl}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover contrast-105"
        />

        {/* Ambient Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

        {/* Play / Pause Overlay Flash */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
              <span className="text-xl">⏸</span>
            </div>
          </div>
        )}
      </div>

      {/* Up / Down Navigation Controls (Desktop) */}
      <div className="hidden lg:flex flex-col gap-2 absolute -right-14 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white transition-all shadow-lg"
          title="Previous Reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === reels.length - 1}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white transition-all shadow-lg"
          title="Next Reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Right Action Rail */}
      <div className="absolute right-4 bottom-20 z-30 flex flex-col items-center gap-4">
        {/* Creator Avatar with Indian Tricolour Ring */}
        <div className="relative group cursor-pointer mb-2">
          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] shadow-lg">
            <img
              src={currentReel.user.avatar}
              alt={currentReel.user.username}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {!currentReel.user.isFollowing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFollow(currentReel.user.id);
              }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#046A38] text-white text-[10px] font-bold flex items-center justify-center shadow-md hover:scale-110"
              title="Follow"
            >
              +
            </button>
          )}
        </div>

        {/* 1. Like Reel */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLikeReel(currentReel.id);
          }}
          className="flex flex-col items-center gap-1 text-white hover:text-rose-400 active:scale-125 transition-transform"
        >
          <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-lg">
            <Heart
              className={`w-6 h-6 transition-colors ${
                currentReel.hasLiked ? 'text-rose-500 fill-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(255,46,147,0.8)]' : 'stroke-[2]'
              }`}
            />
          </div>
          <span className="text-[10px] font-bold tracking-wider">
            {currentReel.likesCount.toLocaleString()}
          </span>
        </button>

        {/* 2. Comment Reel */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenComments();
          }}
          className="flex flex-col items-center gap-1 text-white hover:text-cyan-400 transition-transform"
        >
          <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-lg">
            <MessageCircle className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-[10px] font-bold tracking-wider">
            {currentReel.commentsCount.toLocaleString()}
          </span>
        </button>

        {/* 3. Share Reel */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenShare();
          }}
          className="flex flex-col items-center gap-1 text-white hover:text-[#FF7A00] transition-transform"
        >
          <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-lg">
            <Send className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-[10px] font-bold tracking-wider">
            {currentReel.sharesCount.toLocaleString()}
          </span>
        </button>

        {/* 4. Save Reel */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveReel(currentReel.id);
          }}
          className="flex flex-col items-center gap-1 text-white hover:text-amber-400 transition-transform"
        >
          <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-lg">
            <Bookmark
              className={`w-6 h-6 ${
                currentReel.hasSaved ? 'text-amber-400 fill-amber-400' : 'stroke-[2]'
              }`}
            />
          </div>
        </button>

        {/* 5. Sound Mute / Unmute Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white hover:bg-black/70 transition-colors shadow-lg"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-amber-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>
      </div>

      {/* Bottom Creator Info & Music Overlay */}
      <div className="absolute left-4 right-16 bottom-5 z-20 text-white pointer-events-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm tracking-wide">
            @{currentReel.user.username}
          </span>
          {currentReel.user.isVerified && (
            <Check className="w-3.5 h-3.5 text-white fill-white rounded-full" />
          )}
          {!currentReel.user.isFollowing && (
            <button
              onClick={() => toggleFollow(currentReel.user.id)}
              className="ml-2 px-2.5 py-0.5 rounded-full border border-white/40 text-[11px] font-medium hover:border-white transition-colors"
            >
              Follow
            </button>
          )}
        </div>

        <p className="text-xs text-white/90 line-clamp-2 leading-relaxed mb-3">
          {currentReel.caption}
        </p>

        {/* Rotating Music Track Banner */}
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Music className="w-3.5 h-3.5 shrink-0 animate-bounce" />
          <span className="truncate max-w-[200px] text-[11px]">
            {currentReel.musicTitle} · {currentReel.musicArtist}
          </span>
          <div className="ml-auto w-7 h-7 rounded-full border border-white/30 p-1 animate-spin duration-1000 shrink-0">
            <Disc className="w-full h-full text-white/70" />
          </div>
        </div>
      </div>
    </div>
  );
};
