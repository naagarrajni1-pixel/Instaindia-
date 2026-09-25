import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Repeat, Send, Check, Sparkles } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const {
    activeSharePost,
    setActiveSharePost,
    sharePost,
    creators,
    currentUser,
    createStory,
    showToast,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [sentRecipients, setSentRecipients] = useState<Record<string, boolean>>({});

  if (!activeSharePost) return null;

  const handleCopy = async () => {
    await sharePost(activeSharePost.id, 'copy_link');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRepostToProfile = async () => {
    await sharePost(activeSharePost.id, 'share_to_profile');
    setActiveSharePost(null);
  };

  const handleShareToStory = () => {
    createStory({
      mediaUrl: activeSharePost.mediaUrl,
      caption: `Shared from @${activeSharePost.user.username} ✨`,
    });
    setActiveSharePost(null);
    showToast('Post added to your story! 🖤');
  };

  const handleSendDM = async (recipientId: string) => {
    await sharePost(activeSharePost.id, 'send_dm', recipientId);
    setSentRecipients((prev) => ({ ...prev, [recipientId]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 select-none">
      <div
        className="absolute inset-0"
        onClick={() => setActiveSharePost(null)}
      />

      <div className="relative z-10 w-full md:max-w-md bg-[#101010] border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Mobile Handle */}
        <div className="md:hidden pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <h2 className="text-sm font-semibold tracking-wide text-white">Share Post</h2>
          <button
            onClick={() => setActiveSharePost(null)}
            className="p-1 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Preview Thumbnail */}
        <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0">
            <img
              src={activeSharePost.mediaUrl}
              alt="Post preview"
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white">
              @{activeSharePost.user.username}
            </p>
            <p className="text-[11px] text-white/60 truncate mt-0.5">
              {activeSharePost.caption}
            </p>
          </div>
        </div>

        {/* Primary Social Actions Grid */}
        <div className="p-4 grid grid-cols-3 gap-3 border-b border-white/10">
          {/* Action 1: Copy Link */}
          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5 text-white" />
              )}
            </div>
            <span className="text-[11px] font-medium text-white/80">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>

          {/* Action 2: Share to Own Profile */}
          <button
            onClick={handleRepostToProfile}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Repeat className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-medium text-white/80">
              Repost to Feed
            </span>
          </button>

          {/* Action 3: Add to Story */}
          <button
            onClick={handleShareToStory}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-medium text-white/80">
              Add to Story
            </span>
          </button>
        </div>

        {/* Send as Direct Message to Creators */}
        <div className="p-4 max-h-56 overflow-y-auto luxury-scrollbar">
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
            Send via Direct Message
          </h3>
          <div className="space-y-2">
            {creators
              .filter((c) => c.id !== currentUser.id)
              .map((creator) => {
                const isSent = sentRecipients[creator.id];
                return (
                  <div
                    key={creator.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                        <img
                          src={creator.avatar}
                          alt={creator.username}
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {creator.username}
                        </p>
                        <p className="text-[10px] text-white/50 truncate max-w-[150px]">
                          {creator.fullName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendDM(creator.id)}
                      disabled={isSent}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSent
                          ? 'bg-white/10 text-white/60 cursor-default'
                          : 'bg-white text-black hover:bg-white/90 active:scale-95'
                      }`}
                    >
                      {isSent ? 'Sent' : 'Send'}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
