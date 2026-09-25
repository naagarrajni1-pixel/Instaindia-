import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Compass,
  Film,
  MessageSquare,
  Heart,
  PlusSquare,
  Database,
  Coins,
  Download,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { InstaIndiaLogo } from './InstaIndiaLogo';

interface NavigationProps {
  onOpenDownloadModal: () => void;
  onOpenMonetizeModal: () => void;
  onOpenPlayStorePublishModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenDownloadModal,
  onOpenMonetizeModal,
  onOpenPlayStorePublishModal,
}) => {
  const {
    activeTab,
    setActiveTab,
    setIsCreateModalOpen,
    setIsSupabaseModalOpen,
    conversations,
    notifications,
    currentUser,
  } = useApp();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 border-r border-white/10 bg-[#0a0a10] px-5 py-6 z-30 select-none">
        <div>
          {/* Brand Wordmark with Indian Flag Camera Logo */}
          <div
            onClick={() => setActiveTab('feed')}
            className="cursor-pointer mb-8 px-1 group"
          >
            <InstaIndiaLogo size="md" />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-[#FF671F]/20 via-white/10 to-[#046A38]/20 text-white border border-white/20 shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className={`w-5 h-5 ${activeTab === 'feed' ? 'stroke-[2.5] text-[#FF7A00]' : 'stroke-[1.75]'}`} />
              <span>Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-gradient-to-r from-[#FF671F]/20 via-white/10 to-[#046A38]/20 text-white border border-white/20 shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5] text-[#FF1361]' : 'stroke-[1.75]'}`} />
              <span>Explore</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'reels'
                  ? 'bg-gradient-to-r from-[#FF671F]/20 via-white/10 to-[#046A38]/20 text-white border border-white/20 shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className={`w-5 h-5 ${activeTab === 'reels' ? 'stroke-[2.5] text-amber-400' : 'stroke-[1.75]'}`} />
              <span>Reels 4K</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-r from-[#FF671F]/20 via-white/10 to-[#046A38]/20 text-white border border-white/20 shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <MessageSquare className={`w-5 h-5 ${activeTab === 'messages' ? 'stroke-[2.5] text-cyan-400' : 'stroke-[1.75]'}`} />
                <span>Messages</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF671F] to-[#FF1361] text-white text-[11px] font-bold shadow-md">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-[#FF671F]/20 via-white/10 to-[#046A38]/20 text-white border border-white/20 shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <Heart className={`w-5 h-5 ${activeTab === 'notifications' ? 'stroke-[2.5] text-pink-500 fill-pink-500' : 'stroke-[1.75]'}`} />
                <span>Activity</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF671F] animate-ping" />
              )}
            </button>

            {/* EARN MONEY / CREATOR MONETIZATION BUTTON */}
            <button
              onClick={onOpenMonetizeModal}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-500/15 via-[#FF671F]/15 to-emerald-500/15 border border-amber-500/30 text-amber-300 hover:border-amber-400 transition-all group my-1 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Earn Money</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black">
                ₹84K
              </span>
            </button>

            {/* CREATE PHOTO / REEL BUTTON */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#046A38] hover:opacity-95 shadow-lg shadow-orange-950/20 active:scale-95 transition-all mt-1"
            >
              <PlusSquare className="w-5 h-5 stroke-[2.5]" />
              <span>Create Post</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all mt-1 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#FF671F]/20 via-white/10 to-[#046A38]/20 text-white border border-white/20 shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden p-[1.5px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* Desktop Bottom: Play Store Publishing & Supabase */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
          <button
            onClick={onOpenPlayStorePublishModal}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-[#FF671F]/20 to-blue-500/20 border border-emerald-500/40 hover:border-emerald-400 text-xs font-black text-white transition-all group shadow-md active:scale-95"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Upload Play Store</span>
            </div>
            <span className="text-[10px] bg-emerald-400 text-black px-2 py-0.5 rounded-full font-bold">
              LIVE
            </span>
          </button>

          <button
            onClick={onOpenDownloadModal}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-400 text-xs font-bold text-white transition-all group shadow-md"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Play Store / iOS App</span>
            </div>
            <span className="text-[10px] text-blue-300 font-bold">4.9★</span>
          </button>

          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs transition-colors"
          >
            <div className="flex items-center gap-2 text-white/70">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Cloud</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              ● Active (Fast Net)
            </span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE TOP HEADER ================= */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0a0a10]/95 backdrop-blur-xl border-b border-white/10 px-3.5 h-15 flex items-center justify-between">
        <div onClick={() => setActiveTab('feed')} className="cursor-pointer">
          <InstaIndiaLogo size="sm" />
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Upload Play Store Mobile */}
          <button
            onClick={onOpenPlayStorePublishModal}
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-[#FF7A00] text-black text-[11px] font-black flex items-center gap-1 shadow-md active:scale-95 transition-transform"
          >
            <span>Play Store</span>
          </button>

          {/* Quick Earn Money Button Mobile */}
          <button
            onClick={onOpenMonetizeModal}
            className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-[#FF671F] text-black text-[11px] font-black flex items-center gap-1 shadow-md active:scale-95 transition-transform"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>₹</span>
          </button>

          {/* Quick App Download Mobile */}
          <button
            onClick={onOpenDownloadModal}
            className="p-1.5 rounded-full bg-white/10 text-white/90"
            title="Download App"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className="p-1.5 text-white/80 hover:text-white relative"
          >
            <Heart className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF671F]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="p-1.5 text-white/80 hover:text-white relative"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#FF671F] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ================= MOBILE BOTTOM TAB BAR ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a10]/95 backdrop-blur-xl border-t border-white/10 px-3 h-16 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center p-2 min-w-[48px] min-h-[48px] transition-colors ${
            activeTab === 'feed' ? 'text-[#FF7A00]' : 'text-white/40'
          }`}
          aria-label="Feed"
        >
          <Home className={`w-6 h-6 ${activeTab === 'feed' ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center p-2 min-w-[48px] min-h-[48px] transition-colors ${
            activeTab === 'explore' ? 'text-[#FF1361]' : 'text-white/40'
          }`}
          aria-label="Explore"
        >
          <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex flex-col items-center justify-center p-2 min-w-[48px] min-h-[48px] active:scale-95 transition-transform"
          aria-label="Create Post"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF671F] via-[#FF007F] to-[#046A38] flex items-center justify-center shadow-lg shadow-orange-500/30">
            <PlusSquare className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex flex-col items-center justify-center p-2 min-w-[48px] min-h-[48px] transition-colors ${
            activeTab === 'reels' ? 'text-amber-400' : 'text-white/40'
          }`}
          aria-label="Reels"
        >
          <Film className={`w-6 h-6 ${activeTab === 'reels' ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center p-2 min-w-[48px] min-h-[48px] transition-colors ${
            activeTab === 'profile' ? 'text-emerald-400' : 'text-white/40'
          }`}
          aria-label="Profile"
        >
          <div
            className={`w-7 h-7 rounded-full overflow-hidden p-[1.5px] ${
              activeTab === 'profile'
                ? 'bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] ring-2 ring-emerald-400'
                : 'border border-white/30'
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </button>
      </nav>
    </>
  );
};

