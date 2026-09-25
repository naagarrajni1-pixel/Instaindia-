import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Send, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const StoryModal: React.FC = () => {
  const {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    sendDirectMessage,
    conversations,
    showToast,
    currentUser,
  } = useApp();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likedStory, setLikedStory] = useState(false);

  const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  // Auto-advance timer
  useEffect(() => {
    if (activeStoryIndex === null) return;
    setProgress(0);
    setLikedStory(false);

    const DURATION = 5000; // 5s per story
    const INTERVAL = 50;
    const step = (INTERVAL / DURATION) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev >= 100) {
            // Next story or close
            if (activeStoryIndex < stories.length - 1) {
              setActiveStoryIndex(activeStoryIndex + 1);
            } else {
              setActiveStoryIndex(null);
            }
            return 0;
          }
          return prev + step;
        });
      }
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused, stories.length, setActiveStoryIndex]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeStoryIndex === null) return;
      if (e.key === 'Escape') setActiveStoryIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') setIsPaused((p) => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStoryIndex]);

  if (!currentStory || activeStoryIndex === null) return null;

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Send DM to the creator
    const targetUserId = currentStory.user.id;
    let conv = conversations.find((c) => c.participant.id === targetUserId);
    const convId = conv ? conv.id : `conv_${targetUserId}`;

    sendDirectMessage(convId, `Replied to your story: "${replyText.trim()}"`);
    setReplyText('');
    showToast(`Replied to @${currentStory.user.username} 🤍`);
  };

  const handleLikeStory = () => {
    setLikedStory(!likedStory);
    const targetUserId = currentStory.user.id;
    let conv = conversations.find((c) => c.participant.id === targetUserId);
    const convId = conv ? conv.id : `conv_${targetUserId}`;
    sendDirectMessage(convId, `❤️ Reacted to your story`);
    showToast(`Reacted to @${currentStory.user.username}'s story`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center select-none">
      {/* Navigation Arrows for Desktop */}
      <button
        onClick={handlePrev}
        disabled={activeStoryIndex === 0}
        className="hidden md:flex absolute left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white transition-all z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        disabled={activeStoryIndex === stories.length - 1}
        className="hidden md:flex absolute right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white transition-all z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Story Viewport Card */}
      <div
        className="relative w-full h-full md:max-w-md md:h-[88vh] md:max-h-[820px] bg-[#111] md:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bar Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1.5 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] transition-all duration-75"
                style={{
                  width:
                    idx < activeStoryIndex
                      ? '100%'
                      : idx === activeStoryIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-7 left-4 right-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden p-[1.5px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38]">
              <img
                src={currentStory.user.avatar}
                alt={currentStory.user.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-wide">
                  {currentStory.user.username}
                </span>
                {currentStory.user.isVerified && (
                  <Check className="w-3 h-3 text-white fill-white rounded-full" />
                )}
              </div>
              <span className="text-[10px] text-white/70">{currentStory.createdAt}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveStoryIndex(null)}
            className="p-2 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Story Main Image in Full Vibrant Color */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <img
            src={currentStory.mediaUrl}
            alt="Story content"
            className="w-full h-full object-cover contrast-105"
          />

          {/* Tap Zones */}
          <div
            onClick={handlePrev}
            className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
            title="Previous Story"
          />
          <div
            onClick={handleNext}
            className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
            title="Next Story"
          />

          {/* Story Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20 text-center">
              <span className="inline-block px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md text-sm text-white/90 font-medium border border-white/10">
                {currentStory.caption}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Reply Bar */}
        <div className="relative z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Send message to @${currentStory.user.username}...`}
              className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-30 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleLikeStory}
              className={`p-2.5 rounded-full border border-white/20 transition-all ${
                likedStory ? 'bg-white text-black scale-110' : 'bg-white/10 text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${likedStory ? 'fill-black' : ''}`} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
