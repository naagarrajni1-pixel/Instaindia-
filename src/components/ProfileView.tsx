import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Grid,
  Film,
  Bookmark,
  UserCheck,
  Check,
  Edit2,
  Share2,
  MapPin,
  Globe,
  Settings,
  X,
  Heart,
  MessageCircle,
  Plus,
  Lock,
} from 'lucide-react';
import { User, Post } from '../types';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    posts,
    reels,
    setActiveDetailPost,
    showToast,
    creators,
    toggleFollow,
    setActiveConversationId,
    setActiveTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'reels' | 'saved' | 'creators'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    fullName: currentUser.fullName,
    username: currentUser.username,
    bio: currentUser.bio,
    location: currentUser.location || '',
    website: currentUser.website || '',
    avatar: currentUser.avatar,
  });

  // Viewed profile (either current user or a selected creator)
  const isViewingSelf = !selectedCreatorId || selectedCreatorId === currentUser.id;
  const viewedUser: User = isViewingSelf
    ? currentUser
    : creators.find((c) => c.id === selectedCreatorId) || currentUser;

  // Filter posts for viewed user
  const userPosts = posts.filter((p) => p.userId === viewedUser.id);
  const userReels = reels.filter((r) => r.userId === viewedUser.id);
  const savedPosts = posts.filter((p) => p.hasSaved);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: editForm.fullName.trim(),
      username: editForm.username.trim(),
      bio: editForm.bio.trim(),
      location: editForm.location.trim(),
      website: editForm.website.trim(),
      avatar: editForm.avatar.trim() || currentUser.avatar,
    });
    setIsEditModalOpen(false);
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/@${viewedUser.username}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
    }
    showToast(`Profile link copied to clipboard ✨`);
  };

  const highlights = [
    { title: 'Palaces', cover: '/src/assets/images/instaindia_palace_monochrome_1790314744265.jpg' },
    { title: 'Couture', cover: '/src/assets/images/instaindia_couture_fashion_1790314759630.jpg' },
    { title: 'Kathak', cover: '/src/assets/images/instaindia_reel_kathak_dance_1790314776124.jpg' },
    { title: 'Nocturne', cover: '/src/assets/images/instaindia_reel_mumbai_skyline_1790314787781.jpg' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 select-none pb-24">
      {/* If viewing another creator, show a back-to-my-profile bar */}
      {!isViewingSelf && (
        <div className="mb-6 flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
          <span className="text-xs text-white/70">
            Viewing creator profile: <strong className="text-white">@{viewedUser.username}</strong>
          </span>
          <button
            onClick={() => setSelectedCreatorId(null)}
            className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-black hover:bg-white/90"
          >
            Back to My Profile
          </button>
        </div>
      )}

      {/* ================= PROFILE HEADER ================= */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 mb-8 border-b border-white/10 pb-8">
        {/* Avatar with Tricolour Gradient Ring */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-[3px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] shadow-2xl overflow-hidden">
            <img
              src={viewedUser.avatar}
              alt={viewedUser.username}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {isViewingSelf && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#046A38] text-white shadow-lg hover:scale-110 transition-transform"
              title="Change profile avatar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bio & Details */}
        <div className="flex-1 text-center md:text-left">
          {/* Top Row: Username & Actions */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                {viewedUser.username}
              </h1>
              {viewedUser.isVerified && (
                <Check className="w-4 h-4 text-blue-400 fill-blue-400 rounded-full" />
              )}
              <span className="text-sm">🇮🇳</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              {isViewingSelf ? (
                <>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleShareProfile}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Share profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleFollow(viewedUser.id)}
                    className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      viewedUser.isFollowing
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        : 'bg-gradient-to-r from-[#FF7A00] to-[#046A38] text-white hover:opacity-90 active:scale-95'
                    }`}
                  >
                    {viewedUser.isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button
                    onClick={() => {
                      const conv = `conv_${viewedUser.id}`;
                      setActiveConversationId(conv);
                      setActiveTab('messages');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Followers & Following Counters */}
          <div className="flex items-center justify-center md:justify-start gap-8 mb-3 text-xs">
            <div>
              <span className="font-bold text-white text-base mr-1">
                {userPosts.length}
              </span>
              <span className="text-white/60">posts</span>
            </div>
            <div className="cursor-pointer hover:text-white transition-colors">
              <span className="font-bold text-white text-base mr-1">
                {viewedUser.followersCount.toLocaleString()}
              </span>
              <span className="text-white/60">followers</span>
            </div>
            <div className="cursor-pointer hover:text-white transition-colors">
              <span className="font-bold text-white text-base mr-1">
                {viewedUser.followingCount.toLocaleString()}
              </span>
              <span className="text-white/60">following</span>
            </div>
          </div>

          {/* Full Name & Bio Prose */}
          <div className="space-y-1.5 text-xs text-white/90">
            <h2 className="font-bold text-white tracking-wide text-sm">
              {viewedUser.fullName}
            </h2>
            <p className="whitespace-pre-line text-white/80 max-w-lg leading-relaxed">
              {viewedUser.bio}
            </p>
            {viewedUser.location && (
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] text-emerald-400 font-medium pt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{viewedUser.location}</span>
              </div>
            )}
            {viewedUser.website && (
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] text-[#FF7A00] pt-0.5">
                <Globe className="w-3.5 h-3.5 text-white/60" />
                <a
                  href={viewedUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline font-semibold"
                >
                  {viewedUser.website.replace('https://', '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= STORY HIGHLIGHTS ================= */}
      <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-5 min-w-max">
          {highlights.map((h, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 cursor-pointer group">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] group-hover:scale-105 transition-all overflow-hidden bg-black shadow-md">
                <img
                  src={h.cover}
                  alt={h.title}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">
                {h.title}
              </span>
            </div>
          ))}

          {isViewingSelf && (
            <div
              onClick={() => showToast('Create new highlight album 🖤')}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full border border-dashed border-white/30 group-hover:border-white flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-white/60 group-hover:text-white" />
              </div>
              <span className="text-[11px] text-white/50 group-hover:text-white">
                New
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex items-center justify-center border-t border-white/10 mb-6">
        <button
          onClick={() => setActiveSubTab('posts')}
          className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold border-t-2 -mt-[2px] transition-colors ${
            activeSubTab === 'posts'
              ? 'border-white text-white'
              : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reels')}
          className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold border-t-2 -mt-[2px] transition-colors ${
            activeSubTab === 'reels'
              ? 'border-white text-white'
              : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels ({userReels.length})</span>
        </button>

        {isViewingSelf && (
          <button
            onClick={() => setActiveSubTab('saved')}
            className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold border-t-2 -mt-[2px] transition-colors ${
              activeSubTab === 'saved'
                ? 'border-white text-white'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedPosts.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveSubTab('creators')}
          className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold border-t-2 -mt-[2px] transition-colors ${
            activeSubTab === 'creators'
              ? 'border-white text-white'
              : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Discover</span>
        </button>
      </div>

      {/* ================= CONTENT GRIDS ================= */}
      {/* 1. Posts Grid */}
      {activeSubTab === 'posts' && (
        <div>
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActiveDetailPost(post)}
                  className="relative aspect-square group bg-black cursor-pointer overflow-hidden rounded-md md:rounded-xl border border-white/10"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${post.filter || ''}`}
                  />
                  {/* Hover Overlay with Likes & Comments Count */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-xs font-semibold backdrop-blur-[2px]">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{post.likesCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-white/40 text-xs">
              <Grid className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No photographs shared yet.</p>
            </div>
          )}
        </div>
      )}

      {/* 2. Reels Grid */}
      {activeSubTab === 'reels' && (
        <div>
          {userReels.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {userReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => setActiveTab('reels')}
                  className="relative aspect-[9/16] group bg-black cursor-pointer overflow-hidden rounded-xl border border-white/10 shadow-lg"
                >
                  <img
                    src={reel.posterUrl}
                    alt={reel.caption}
                    className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] text-white font-semibold drop-shadow-md">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>{reel.likesCount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-white/40 text-xs">
              <Film className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No reels created yet.</p>
            </div>
          )}
        </div>
      )}

      {/* 3. Saved Posts Grid (Private to logged in user) */}
      {activeSubTab === 'saved' && (
        <div>
          <div className="flex items-center gap-2 text-xs text-white/40 mb-4 px-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Only you can see what you've saved</span>
          </div>

          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActiveDetailPost(post)}
                  className="relative aspect-square group bg-black cursor-pointer overflow-hidden rounded-md md:rounded-xl border border-white/10"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${post.filter || ''}`}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-xs font-semibold backdrop-blur-[2px]">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{post.likesCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4 fill-white" />
                      <span>Saved</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-white/40 text-xs">
              <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Save photos to view them later in your luxury vault.</p>
            </div>
          )}
        </div>
      )}

      {/* 4. Discover Indian Creators */}
      {activeSubTab === 'creators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {creators.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 hover:bg-white/[0.06] transition-colors"
            >
              <div
                onClick={() => setSelectedCreatorId(c.id)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] shrink-0">
                  <img
                    src={c.avatar}
                    alt={c.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">
                      {c.username}
                    </span>
                    {c.isVerified && (
                      <Check className="w-3.5 h-3.5 text-blue-400 fill-blue-400 rounded-full" />
                    )}
                  </div>
                  <p className="text-[11px] text-white/60 truncate max-w-xs">{c.fullName}</p>
                  <p className="text-[10px] text-white/40 truncate max-w-xs mt-0.5">{c.bio}</p>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  c.isFollowing
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-gradient-to-r from-[#FF7A00] to-[#046A38] text-white hover:opacity-90'
                }`}
              >
                {c.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#101010] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-semibold text-white">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block mb-1">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="e.g. New Delhi, India"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider block mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  placeholder="https://instaindia.luxury"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black font-semibold hover:bg-white/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
