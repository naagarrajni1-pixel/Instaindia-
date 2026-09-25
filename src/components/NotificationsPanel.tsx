import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, MessageCircle, UserPlus, Bookmark, Check } from 'lucide-react';

export const NotificationsPanel: React.FC = () => {
  const {
    notifications,
    markNotificationsAsRead,
    toggleFollow,
    setActiveDetailPost,
  } = useApp();

  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 select-none pb-24">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <h1 className="text-base font-bold tracking-wide text-white">Notifications</h1>
        <span className="text-[11px] text-white/50">Recent Activity</span>
      </div>

      <div className="divide-y divide-white/5">
        {notifications.map((item) => {
          return (
            <div
              key={item.id}
              className="py-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors rounded-xl px-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Notification Icon Badge */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20">
                    <img
                      src={item.actor.avatar}
                      alt={item.actor.username}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
                    {item.type === 'like' && <Heart className="w-3 h-3 fill-black" />}
                    {item.type === 'comment' && <MessageCircle className="w-3 h-3 fill-black" />}
                    {item.type === 'follow' && <UserPlus className="w-3 h-3 stroke-[2.5]" />}
                    {item.type === 'save' && <Bookmark className="w-3 h-3 fill-black" />}
                  </div>
                </div>

                {/* Content text */}
                <div className="text-xs leading-relaxed truncate">
                  <span className="font-semibold text-white mr-1">
                    {item.actor.username}
                  </span>
                  <span className="text-white/70">{item.text}</span>
                  <div className="text-[10px] text-white/40 mt-0.5">{item.createdAt}</div>
                </div>
              </div>

              {/* Action Button or Post Thumbnail */}
              {item.type === 'follow' ? (
                <button
                  onClick={() => toggleFollow(item.actor.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                    item.actor.isFollowing
                      ? 'bg-white/10 text-white'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {item.actor.isFollowing ? 'Following' : 'Follow'}
                </button>
              ) : item.post ? (
                <div
                  onClick={() => setActiveDetailPost(item.post!)}
                  className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={item.post.mediaUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
