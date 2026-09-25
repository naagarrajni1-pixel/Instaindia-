import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Check,
  MoreHorizontal,
} from 'lucide-react';

export const PostDetailModal: React.FC = () => {
  const {
    activeDetailPost,
    setActiveDetailPost,
    toggleLikePost,
    toggleSavePost,
    addComment,
    comments,
    setActiveSharePost,
    toggleFollow,
    currentUser,
  } = useApp();

  const [commentInput, setCommentInput] = useState('');

  if (!activeDetailPost) return null;

  const postComments = comments[activeDetailPost.id] || [];
  const isOwnPost = activeDetailPost.userId === currentUser.id;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(activeDetailPost.id, commentInput);
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 md:p-6 select-none">
      <div
        className="absolute inset-0"
        onClick={() => setActiveDetailPost(null)}
      />

      <div className="relative z-10 w-full max-w-4xl bg-[#0c0c0c] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setActiveDetailPost(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Container */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[500px]">
          <img
            src={activeDetailPost.mediaUrl}
            alt={activeDetailPost.caption}
            className={`w-full h-full object-contain max-h-[70vh] ${activeDetailPost.filter || ''}`}
          />
        </div>

        {/* Details & Comments Pane */}
        <div className="w-full md:w-96 bg-[#0e0e0e] border-l border-white/10 flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20">
                <img
                  src={activeDetailPost.user.avatar}
                  alt={activeDetailPost.user.username}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white">
                    {activeDetailPost.user.username}
                  </span>
                  {activeDetailPost.user.isVerified && (
                    <Check className="w-3 h-3 text-white fill-white rounded-full" />
                  )}
                  {!isOwnPost && !activeDetailPost.user.isFollowing && (
                    <>
                      <span className="text-white/40 text-xs">·</span>
                      <button
                        onClick={() => toggleFollow(activeDetailPost.user.id)}
                        className="text-xs font-semibold text-white/90 hover:text-white"
                      >
                        Follow
                      </button>
                    </>
                  )}
                </div>
                {activeDetailPost.location && (
                  <span className="text-[10px] text-white/40">
                    {activeDetailPost.location}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveDetailPost(null)}
              className="hidden md:block p-1 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comments and Caption Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 luxury-scrollbar">
            {/* Author caption */}
            <div className="flex items-start gap-3 pb-3 border-b border-white/5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                <img
                  src={activeDetailPost.user.avatar}
                  alt={activeDetailPost.user.username}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="text-xs leading-relaxed">
                <span className="font-semibold text-white mr-1.5">
                  {activeDetailPost.user.username}
                </span>
                <span className="text-white/80">{activeDetailPost.caption}</span>
                <div className="text-[10px] text-white/30 mt-1 uppercase">
                  {activeDetailPost.createdAt}
                </div>
              </div>
            </div>

            {/* Comments List */}
            {postComments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.username}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div className="text-xs leading-relaxed flex-1">
                  <span className="font-semibold text-white mr-1.5">
                    {comment.user.username}
                  </span>
                  <span className="text-white/80">{comment.text}</span>
                  <div className="flex items-center gap-3 text-[10px] text-white/40 mt-1">
                    <span>{comment.createdAt}</span>
                    <span>{comment.likesCount} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Actions & Likes Count */}
          <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLikePost(activeDetailPost.id)}
                  className="text-white hover:text-white/80 transition-transform active:scale-125"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      activeDetailPost.hasLiked ? 'text-white fill-white' : 'stroke-[1.75]'
                    }`}
                  />
                </button>
                <button
                  onClick={() => setActiveSharePost(activeDetailPost)}
                  className="text-white/80 hover:text-white"
                >
                  <Send className="w-6 h-6 stroke-[1.75]" />
                </button>
              </div>

              <button
                onClick={() => toggleSavePost(activeDetailPost.id)}
                className="text-white/80 hover:text-white transition-transform active:scale-125"
              >
                <Bookmark
                  className={`w-6 h-6 ${
                    activeDetailPost.hasSaved ? 'text-white fill-white' : 'stroke-[1.75]'
                  }`}
                />
              </button>
            </div>

            <div className="text-xs font-semibold text-white tracking-wide">
              {activeDetailPost.likesCount.toLocaleString()} likes
            </div>

            {/* Inline Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a remark..."
                className="flex-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="text-xs font-semibold text-white disabled:opacity-20 hover:underline"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
