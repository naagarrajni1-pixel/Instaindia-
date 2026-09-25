import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { StoriesBar } from './components/StoriesBar';
import { PostCard } from './components/PostCard';
import { StoryModal } from './components/StoryModal';
import { CommentsDrawer } from './components/CommentsDrawer';
import { ShareModal } from './components/ShareModal';
import { PhotoStudioModal } from './components/PhotoStudioModal';
import { PostDetailModal } from './components/PostDetailModal';
import { ExplorePage } from './components/ExplorePage';
import { ReelsFeed } from './components/ReelsFeed';
import { DirectMessages } from './components/DirectMessages';
import { NotificationsPanel } from './components/NotificationsPanel';
import { ProfileView } from './components/ProfileView';
import { SupabaseModal } from './components/SupabaseModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { MonetizeModal } from './components/MonetizeModal';
import { PlayStorePublishModal } from './components/PlayStorePublishModal';
import { Toast } from './components/Toast';
import { Check, Sparkles, PlusSquare, Coins, Smartphone, Zap, Upload } from 'lucide-react';

interface MainFeedProps {
  onOpenDownloadModal: () => void;
  onOpenMonetizeModal: () => void;
  onOpenPlayStorePublishModal: () => void;
}

const MainFeed: React.FC<MainFeedProps> = ({
  onOpenDownloadModal,
  onOpenMonetizeModal,
  onOpenPlayStorePublishModal,
}) => {
  const { posts, creators, currentUser, toggleFollow, setIsCreateModalOpen, setActiveTab } = useApp();

  return (
    <div className="w-full max-w-5xl mx-auto flex gap-8 justify-center py-4 px-2 md:px-4">
      {/* Central Posts Feed */}
      <div className="w-full max-w-[520px] flex flex-col items-center">
        {/* Stories Bar */}
        <StoriesBar />

        {/* Play Store Direct Upload Action Banner */}
        <div className="w-full mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-white/5 to-[#FF671F]/20 border border-emerald-500/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>Google Play Store Deployment</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-400 text-black font-extrabold">
                  READY
                </span>
              </div>
              <p className="text-[10px] text-white/60">
                Package: com.instaindia.social.app (Build 10001)
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPlayStorePublishModal}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#FF7A00] text-black text-xs font-black shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5 stroke-[3]" />
            <span>Upload Now</span>
          </button>
        </div>

        {/* Posts Stream */}
        <div className="w-full mt-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Desktop Right Rail: Profile Switcher & Suggested Indian Creators */}
      <aside className="hidden lg:block w-72 h-fit sticky top-8 space-y-5 select-none">
        {/* Current User Quick Box */}
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0d0d15] border border-white/10 cursor-pointer hover:border-white/20 transition-all shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] shrink-0 shadow-md">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {currentUser.username}
                </span>
                <Check className="w-3.5 h-3.5 text-blue-400 fill-blue-400 rounded-full" />
              </div>
              <span className="text-[10px] text-white/50 truncate block">
                {currentUser.fullName}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#FF7A00] group-hover:text-white">
            Switch
          </span>
        </div>

        {/* Creator Studio & Earn Money Callout Card */}
        <div
          onClick={onOpenMonetizeModal}
          className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#FF671F]/15 to-emerald-500/10 border border-amber-500/30 cursor-pointer hover:border-amber-400 transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
              <Coins className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Creator Fund & Earnings</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black">
              LIVE UPI
            </span>
          </div>
          <div className="text-lg font-black text-white">
            ₹84,250 <span className="text-xs font-normal text-white/60">earned</span>
          </div>
          <p className="text-[10px] text-white/60 mt-1">
            Earn money for 4K Reels & receive tips directly to your Indian bank account.
          </p>
        </div>

        {/* Quick Studio Trigger */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#046A38] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-950/20 active:scale-95 transition-all"
        >
          <PlusSquare className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Colorful Post</span>
        </button>

        {/* Suggested Creators */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-white/60 uppercase tracking-wider text-[11px]">
              Top Indian Creators
            </span>
            <button
              onClick={() => setActiveTab('profile')}
              className="font-bold text-[#FF7A00] hover:text-white text-[11px]"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {creators
              .filter((c) => c.id !== currentUser.id)
              .slice(0, 4)
              .map((creator) => (
                <div key={creator.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38]">
                      <img
                        src={creator.avatar}
                        alt={creator.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="text-xs">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white">
                          {creator.username}
                        </span>
                        {creator.isVerified && (
                          <Check className="w-2.5 h-2.5 text-blue-400 fill-blue-400 rounded-full" />
                        )}
                      </div>
                      <span className="text-[10px] text-white/50 block truncate max-w-[120px]">
                        {creator.bio.split('•')[0]}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(creator.id)}
                    className={`text-xs font-bold transition-colors ${
                      creator.isFollowing
                        ? 'text-white/40'
                        : 'text-[#FF7A00] hover:text-white'
                    }`}
                  >
                    {creator.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* PlayStore & AppStore Quick Teaser */}
        <div
          onClick={onOpenDownloadModal}
          className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/[0.07] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <div className="text-[11px] font-semibold text-white">
              Install Play Store & iOS App
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400">FREE</span>
        </div>

        {/* Minimal Footer */}
        <div className="text-[10px] text-white/30 leading-relaxed pt-1">
          <span>About · Help · Press · API · Privacy · Terms · Made with ❤️ in Bharat</span>
          <div className="mt-1 font-bold text-[9px] text-white/40">
            © 2026 INSTAINDIA · VIBRANT TRICOLOUR SOCIAL NETWORK
          </div>
        </div>
      </aside>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeTab, showToast } = useApp();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isMonetizeModalOpen, setIsMonetizeModalOpen] = useState(false);
  const [isPlayStorePublishModalOpen, setIsPlayStorePublishModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#08080c] text-[#f8fafc] flex flex-col md:flex-row">
      {/* Navigation Layout */}
      <Navigation
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenMonetizeModal={() => setIsMonetizeModalOpen(true)}
        onOpenPlayStorePublishModal={() => setIsPlayStorePublishModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 pb-16 md:pb-0 overflow-x-hidden">
        {activeTab === 'feed' && (
          <MainFeed
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            onOpenMonetizeModal={() => setIsMonetizeModalOpen(true)}
            onOpenPlayStorePublishModal={() => setIsPlayStorePublishModalOpen(true)}
          />
        )}
        {activeTab === 'explore' && <ExplorePage />}
        {activeTab === 'reels' && <ReelsFeed />}
        {activeTab === 'messages' && <DirectMessages />}
        {activeTab === 'notifications' && <NotificationsPanel />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Global Overlays & Modals */}
      <StoryModal />
      <CommentsDrawer />
      <ShareModal />
      <PhotoStudioModal />
      <PostDetailModal />
      <SupabaseModal />
      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onSuccessToast={showToast}
      />
      <MonetizeModal
        isOpen={isMonetizeModalOpen}
        onClose={() => setIsMonetizeModalOpen(false)}
        onSuccessToast={showToast}
      />
      <PlayStorePublishModal
        isOpen={isPlayStorePublishModalOpen}
        onClose={() => setIsPlayStorePublishModalOpen(false)}
        onSuccessToast={showToast}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

