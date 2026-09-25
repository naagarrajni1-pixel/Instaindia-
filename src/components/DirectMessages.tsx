import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Send,
  ArrowLeft,
  Check,
  Phone,
  Video,
  Info,
  Edit3,
  Sparkles,
  Smile,
} from 'lucide-react';
import { Conversation, User } from '../types';

export const DirectMessages: React.FC = () => {
  const {
    conversations,
    creators,
    currentUser,
    sendDirectMessage,
    activeConversationId,
    setActiveConversationId,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default to first conversation on desktop if none selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0 && window.innerWidth >= 768) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId, setActiveConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConversationId]);

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  const filteredConversations = conversations.filter(
    (c) =>
      c.participant.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participant.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversationId) return;

    sendDirectMessage(activeConversationId, messageInput);
    setMessageInput('');
  };

  const handleStartNewChat = (user: User) => {
    const existing = conversations.find((c) => c.participant.id === user.id);
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      const newConvId = `conv_${user.id}`;
      sendDirectMessage(newConvId, `Namaste @${user.username} ✨`);
      setActiveConversationId(newConvId);
    }
    setIsNewChatModalOpen(false);
  };

  const quickPrompts = [
    'Loved your recent monochrome post! 🖤',
    'Are you presenting at Mumbai Art Week?',
    'Let us collaborate on an architectural feature.',
    'Incredible tonality on your latest capture ✨',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-4rem)] md:h-[88vh] bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-2 select-none">
      {/* ================= LEFT PANE: CONVERSATIONS LIST ================= */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-[#0a0a0a] ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white tracking-wide">
              {currentUser.username}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
          </div>
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Start new conversation"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto luxury-scrollbar divide-y divide-white/5">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isSelected = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-[#FF671F] via-white to-[#046A38]">
                      <img
                        src={conv.participant.avatar}
                        alt={conv.participant.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-semibold text-white">
                          {conv.participant.username}
                        </span>
                        {conv.participant.isVerified && (
                          <Check className="w-3 h-3 text-white fill-white rounded-full" />
                        )}
                      </div>
                      {lastMsg && (
                        <span className="text-[10px] text-white/40 shrink-0">
                          {lastMsg.createdAt}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs truncate mt-0.5 ${
                        conv.unreadCount > 0 ? 'text-white font-medium' : 'text-white/50'
                      }`}
                    >
                      {lastMsg ? lastMsg.text : 'Start chatting...'}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-white/40 text-xs">
              No direct messages found.
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT PANE: ACTIVE CHAT ================= */}
      {activeConv ? (
        <div
          className={`flex-1 flex flex-col bg-[#080808] ${
            activeConversationId ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Active Chat Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConversationId(null)}
                className="md:hidden p-1.5 text-white/70 hover:text-white"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                <img
                  src={activeConv.participant.avatar}
                  alt={activeConv.participant.username}
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white">
                    {activeConv.participant.fullName}
                  </span>
                  {activeConv.participant.isVerified && (
                    <Check className="w-3 h-3 text-white fill-white rounded-full" />
                  )}
                </div>
                <span className="text-[10px] text-white/50">
                  @{activeConv.participant.username} · Active now
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast(`Calling @${activeConv.participant.username}...`)}
                className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Audio call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast(`Starting video session with @${activeConv.participant.username}...`)}
                className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Video call"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast(`Profile info: ${activeConv.participant.bio}`)}
                className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                title="Conversation details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 luxury-scrollbar">
            {/* Conversation Introduction */}
            <div className="text-center py-6 border-b border-white/5 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 mx-auto mb-2">
                <img
                  src={activeConv.participant.avatar}
                  alt={activeConv.participant.username}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <h3 className="text-sm font-semibold text-white">
                {activeConv.participant.fullName}
              </h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto mt-1">
                {activeConv.participant.bio}
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/5 text-[10px] text-white/40 tracking-wider uppercase">
                End-to-End Encrypted Monochrome Chat
              </span>
            </div>

            {/* Bubble Messages */}
            {activeConv.messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed transition-all shadow-md ${
                      isMine
                        ? 'bg-gradient-to-r from-[#FF7A00] via-[#FF1361] to-[#9900EF] text-white font-medium rounded-tr-sm shadow-orange-950/30'
                        : 'bg-[#181824] text-white border border-white/10 rounded-tl-sm'
                    }`}
                  >
                    {msg.mediaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                        <img
                          src={msg.mediaUrl}
                          alt="Shared media"
                          className="w-full max-h-48 object-cover grayscale"
                        />
                      </div>
                    )}
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-white/30 mt-1 px-1">
                    {msg.createdAt}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Suggestions */}
          <div className="px-4 py-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar bg-[#0a0a0a]/50">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMessageInput(prompt)}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/70 whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-white/10 bg-[#0a0a0a] flex items-center gap-3"
          >
            <button
              type="button"
              onClick={() => setMessageInput((prev) => prev + ' 🖤')}
              className="p-2 text-white/50 hover:text-white"
              title="Add heart emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Send message..."
              className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
            />

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-2.5 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-20 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Empty Right Pane when no conversation selected */
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-[#080808]">
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-4 text-white/50">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white">Your Direct Messages</h3>
          <p className="text-xs text-white/50 max-w-sm mt-1 mb-5">
            Connect in real-time with India's leading architects, couture designers, and photographers.
          </p>
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-transform active:scale-95"
          >
            Send Message
          </button>
        </div>
      )}

      {/* ================= NEW CHAT USER PICKER MODAL ================= */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#121212] border border-white/10 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-semibold text-white">New Message</h3>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="text-white/60 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-white/50 mb-3">
              Select a creator you follow to start a conversation:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto luxury-scrollbar">
              {creators
                .filter((c) => c.id !== currentUser.id)
                .map((creator) => (
                  <div
                    key={creator.id}
                    onClick={() => handleStartNewChat(creator)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20">
                        <img
                          src={creator.avatar}
                          alt={creator.username}
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white">
                            {creator.username}
                          </span>
                          {creator.isVerified && (
                            <Check className="w-3 h-3 text-white fill-white rounded-full" />
                          )}
                        </div>
                        <span className="text-[10px] text-white/50">{creator.fullName}</span>
                      </div>
                    </div>

                    <button className="px-3 py-1 rounded-full bg-white text-black text-[11px] font-medium">
                      Chat
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
