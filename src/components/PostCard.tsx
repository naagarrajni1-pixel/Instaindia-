import React, { useState } from 'react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Check,
  Share2,
  Copy,
  Repeat,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    toggleLikePost,
    toggleSavePost,
    addComment,
    setActiveCommentPostId,
    setActiveSharePost,
    toggleFollow,
    currentUser,
    sharePost,
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle double-tap like on photo
  const handleMediaDoubleTap = () => {
    if (!post.hasLiked) {
      toggleLikePost(post.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleInlineCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  const isOwnPost = post.userId === currentUser.id;

  return (
    <article className="w-full max-w-[520px] mx-auto bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden mb-6 shadow-xl transition-all">
      {/* ================= POST HEADER ================= */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0e0e14]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38] overflow-hidden shrink-0 shadow-md">
            <img
              src={post.user.avatar}
              alt={post.user.username}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">
                {post.user.username}
              </span>
              {post.user.isVerified && (
                <Check className="w-3.5 h-3.5 text-blue-400 fill-blue-400 rounded-full" />
              )}
              {!isOwnPost && !post.user.isFollowing && (
                <>
                  <span className="text-white/40 text-xs">·</span>
                  <button
                    onClick={() => toggleFollow(post.user.id)}
                    className="text-xs font-bold text-[#FF7A00] hover:text-white transition-colors"
                  >
                    Follow
                  </button>
                </>
              )}
            </div>
            {post.location && (
              <span className="text-[10px] text-emerald-400 block truncate max-w-[200px] font-medium">
                📍 {post.location}
              </span>
            )}
          </div>
        </div>

        {/* Options Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-1.5 text-white/60 hover:text-white rounded-full transition-colors"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Quick Options Dropdown */}
          {showOptionsMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowOptionsMenu(false)}
              />
              <div className="absolute right-0 top-8 z-30 w-48 rounded-xl bg-[#141414] border border-white/15 shadow-2xl py-1 text-xs">
                <button
                  onClick={() => {
                    sharePost(post.id, 'copy_link');
                    setShowOptionsMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white text-left transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
                <button
                  onClick={() => {
                    sharePost(post.id, 'share_to_profile');
                    setShowOptionsMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white text-left transition-colors"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Repost to Profile</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSharePost(post);
                    setShowOptionsMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white text-left transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Sheet</span>
                </button>
                {!isOwnPost && (
                  <button
                    onClick={() => {
                      toggleFollow(post.user.id);
                      setShowOptionsMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-white/10 text-left transition-colors border-t border-white/5"
                  >
                    <span>{post.user.isFollowing ? 'Unfollow' : 'Follow'} @{post.user.username}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= POST MEDIA ================= */}
      <div
        onDoubleClick={handleMediaDoubleTap}
        className="relative w-full bg-black select-none cursor-pointer overflow-hidden flex items-center justify-center min-h-[340px]"
      >
        <img
          src={post.mediaUrl}
          alt={post.caption}
          className={`w-full max-h-[580px] object-cover transition-transform duration-300 ${post.filter || 'filter-normal'}`}
          loading="lazy"
        />

        {/* Double-tap Heart Animation Burst */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-[0_0_25px_rgba(255,19,97,0.9)] animate-heart-burst" />
          </div>
        )}
      </div>

      {/* ================= ACTION BAR ================= */}
      <div className="px-4 pt-3 pb-1 bg-[#0c0c12]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 1. Like Button (Colorful Heart) */}
            <button
              onClick={() => toggleLikePost(post.id)}
              className="p-1 hover:scale-110 transition-transform active:scale-125"
              aria-label={post.hasLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  post.hasLiked
                    ? 'text-rose-500 fill-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(255,46,147,0.6)]'
                    : 'text-white stroke-[1.75] hover:stroke-[2]'
                }`}
              />
            </button>

            {/* 2. Comment Button */}
            <button
              onClick={() => setActiveCommentPostId(post.id)}
              className="p-1 text-white hover:text-cyan-400 transition-colors"
              aria-label="Comment on post"
            >
              <MessageCircle className="w-6 h-6 stroke-[1.75]" />
            </button>

            {/* 3. Share Button */}
            <button
              onClick={() => setActiveSharePost(post)}
              className="p-1 text-white hover:text-[#FF7A00] transition-colors"
              aria-label="Share post"
            >
              <Send className="w-6 h-6 stroke-[1.75]" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* 4. Bookmark / Save Button */}
            <button
              onClick={() => toggleSavePost(post.id)}
              className="p-1 text-white hover:text-amber-400 transition-transform active:scale-125"
              aria-label={post.hasSaved ? 'Remove from saved' : 'Save post'}
            >
              <Bookmark
                className={`w-6 h-6 transition-colors ${
                  post.hasSaved ? 'text-amber-400 fill-amber-400' : 'stroke-[1.75]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Likes Count */}
        <div className="mt-2 text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
          {post.likesCount > 0 ? (
            <>
              <span className="text-rose-400">❤️</span>
              <span>
                {post.likesCount.toLocaleString()} {post.likesCount === 1 ? 'like' : 'likes'}
              </span>
            </>
          ) : (
            <span className="text-white/60">Be the first to like this</span>
          )}
        </div>

        {/* Caption */}
        <div className="mt-1.5 text-xs text-white/90 leading-relaxed">
          <span className="font-semibold text-white mr-2">{post.user.username}</span>
          <span>
            {isExpanded || post.caption.length <= 110
              ? post.caption
              : `${post.caption.slice(0, 110)}... `}
          </span>
          {post.caption.length > 110 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-white/50 hover:text-white ml-1 text-xs"
            >
              more
            </button>
          )}
        </div>

        {/* Comments Count Link */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => setActiveCommentPostId(post.id)}
            className="mt-1 text-xs text-white/40 hover:text-white/70 block transition-colors"
          >
            View all {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
          </button>
        )}

        {/* Timestamp */}
        <div className="mt-1.5 text-[10px] tracking-wider text-white/30 uppercase font-light">
          {post.createdAt}
        </div>
      </div>

      {/* ================= INLINE QUICK COMMENT ================= */}
      <form
        onSubmit={handleInlineCommentSubmit}
        className="mt-2 px-4 py-2.5 border-t border-white/5 flex items-center justify-between gap-3 bg-white/[0.01]"
      >
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Add a monochrome remark..."
          className="flex-1 bg-transparent text-xs text-white placeholder-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!commentInput.trim()}
          className="text-xs font-semibold text-white disabled:opacity-30 disabled:pointer-events-none hover:underline tracking-wide transition-opacity"
        >
          Post
        </button>
      </form>
    </article>
  );
};
