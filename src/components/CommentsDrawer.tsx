import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Send, Check } from 'lucide-react';

export const CommentsDrawer: React.FC = () => {
  const {
    activeCommentPostId,
    setActiveCommentPostId,
    posts,
    comments,
    addComment,
    toggleLikeComment,
    currentUser,
  } = useApp();

  const [inputVal, setInputVal] = useState('');

  if (!activeCommentPostId) return null;

  const targetPost = posts.find((p) => p.id === activeCommentPostId);
  const postComments = comments[activeCommentPostId] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    addComment(activeCommentPostId, inputVal);
    setInputVal('');
  };

  const handleAddEmoji = (emoji: string) => {
    setInputVal((prev) => prev + emoji);
  };

  const quickEmojis = ['🖤', '🤍', '✨', '🔥', '👑', '🇮🇳', '🏛️'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 select-none">
      {/* Backdrop Dismiss */}
      <div
        className="absolute inset-0"
        onClick={() => setActiveCommentPostId(null)}
      />

      {/* Drawer Card */}
      <div className="relative z-10 w-full md:max-w-lg bg-[#0e0e0e] border border-white/10 rounded-t-3xl md:rounded-3xl max-h-[85vh] h-[650px] flex flex-col shadow-2xl overflow-hidden">
        {/* Mobile Drag Handle */}
        <div className="md:hidden pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <h2 className="text-sm font-semibold tracking-wide text-white">Comments</h2>
          <button
            onClick={() => setActiveCommentPostId(null)}
            className="p-1 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Comments Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 luxury-scrollbar">
          {/* Original Post Author Caption */}
          {targetPost && (
            <div className="flex items-start gap-3 pb-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                <img
                  src={targetPost.user.avatar}
                  alt={targetPost.user.username}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="flex-1 text-xs leading-relaxed">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">{targetPost.user.username}</span>
                  {targetPost.user.isVerified && (
                    <Check className="w-3 h-3 text-white fill-white rounded-full" />
                  )}
                  <span className="text-[10px] text-white/40">· {targetPost.createdAt}</span>
                </div>
                <p className="text-white/80 mt-1">{targetPost.caption}</p>
              </div>
            </div>
          )}

          {/* Comments List */}
          {postComments.length > 0 ? (
            postComments.map((comment) => (
              <div key={comment.id} className="flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.username}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">{comment.user.username}</span>
                      {comment.user.isVerified && (
                        <Check className="w-3 h-3 text-white fill-white rounded-full" />
                      )}
                      <span className="text-[10px] text-white/40">· {comment.createdAt}</span>
                    </div>
                    <p className="text-white/90 mt-1 leading-relaxed">{comment.text}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-white/50">
                      <span>{comment.likesCount} {comment.likesCount === 1 ? 'like' : 'likes'}</span>
                      <button
                        onClick={() => setInputVal(`@${comment.user.username} `)}
                        className="hover:text-white"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Like Comment Heart Button */}
                <button
                  onClick={() => toggleLikeComment(activeCommentPostId, comment.id)}
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      comment.hasLiked ? 'text-white fill-white' : ''
                    }`}
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-white/40 text-xs">
              No comments yet. Start the conversation 🖤
            </div>
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div className="px-5 py-1.5 border-t border-white/5 flex items-center justify-around bg-black/30">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="text-base hover:scale-125 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Comment Input Footer */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-white/10 bg-[#080808] flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Add a remark for the community..."
            className="flex-1 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-20 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
