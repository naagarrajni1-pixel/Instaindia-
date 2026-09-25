import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  Reel,
  Story,
  Comment,
  Conversation,
  NotificationItem,
  DirectMessage,
} from '../types';
import {
  CURRENT_USER,
  CREATORS,
  INITIAL_POSTS,
  INITIAL_REELS,
  INITIAL_STORIES,
  INITIAL_COMMENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User;
  creators: User[];
  posts: Post[];
  reels: Reel[];
  stories: Story[];
  comments: Record<string, Comment[]>;
  conversations: Conversation[];
  notifications: NotificationItem[];
  activeTab: 'feed' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile';
  setActiveTab: (tab: 'feed' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile') => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  activeCommentPostId: string | null;
  setActiveCommentPostId: (postId: string | null) => void;
  activeSharePost: Post | null;
  setActiveSharePost: (post: Post | null) => void;
  activeDetailPost: Post | null;
  setActiveDetailPost: (post: Post | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Core Social Actions
  toggleLikePost: (postId: string) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSavePost: (postId: string) => void;
  toggleSaveReel: (reelId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  sharePost: (postId: string, method: 'copy_link' | 'share_to_profile' | 'send_dm', recipientId?: string) => Promise<boolean>;
  toggleFollow: (userId: string) => void;
  createPost: (postData: Partial<Post>) => void;
  createStory: (storyData: Partial<Story>) => void;
  sendDirectMessage: (conversationId: string, text: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'instaindia_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or fallback to initial
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [creators, setCreators] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}creators`);
    return saved ? JSON.parse(saved) : CREATORS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}posts`);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}reels`);
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}stories`);
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}comments`);
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}conversations`);
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile'>('feed');
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<Post | null>(null);
  const [activeDetailPost, setActiveDetailPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}creators`, JSON.stringify(creators));
  }, [creators]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}posts`, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}reels`, JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}stories`, JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}comments`, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}conversations`, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  // Toast banner helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // 1. Toggle Like Post (Real-time)
  const toggleLikePost = (postId: string) => {
    let nowLiked = false;
    let targetPost: Post | undefined;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          nowLiked = !post.hasLiked;
          targetPost = post;
          return {
            ...post,
            hasLiked: nowLiked,
            likesCount: nowLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );

    // Also update activeDetailPost if viewing it
    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost((prev) =>
        prev
          ? {
              ...prev,
              hasLiked: !prev.hasLiked,
              likesCount: !prev.hasLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1),
            }
          : null
      );
    }

    if (nowLiked) {
      // Subtle haptic / sound feedback indication & toast if desired
      if (targetPost && targetPost.userId !== currentUser.id) {
        // Add activity notification
        const newNotif: NotificationItem = {
          id: `notif_${Date.now()}`,
          type: 'like',
          actor: currentUser,
          post: targetPost,
          text: `You liked @${targetPost.user.username}'s post`,
          createdAt: 'Just now',
          isRead: true,
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }
    }
  };

  // 2. Toggle Like Reel
  const toggleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextLiked = !r.hasLiked;
          return {
            ...r,
            hasLiked: nextLiked,
            likesCount: nextLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      })
    );
  };

  // 3. Toggle Save Post (Real-time)
  const toggleSavePost = (postId: string) => {
    let savedState = false;
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          savedState = !post.hasSaved;
          return {
            ...post,
            hasSaved: savedState,
            savesCount: savedState ? post.savesCount + 1 : Math.max(0, post.savesCount - 1),
          };
        }
        return post;
      })
    );

    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost((prev) =>
        prev
          ? {
              ...prev,
              hasSaved: !prev.hasSaved,
              savesCount: !prev.hasSaved ? prev.savesCount + 1 : Math.max(0, prev.savesCount - 1),
            }
          : null
      );
    }

    showToast(
      savedState
        ? 'Saved to your private luxury collection 🤍'
        : 'Removed from your saved collection'
    );
  };

  // 4. Toggle Save Reel
  const toggleSaveReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextSaved = !r.hasSaved;
          showToast(nextSaved ? 'Reel saved to collection' : 'Reel removed from collection');
          return { ...r, hasSaved: nextSaved };
        }
        return r;
      })
    );
  };

  // 5. Add Comment (Real-time)
  const addComment = (postId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      postId,
      user: currentUser,
      text: trimmed,
      createdAt: 'Just now',
      likesCount: 0,
      hasLiked: false,
    };

    // Update comments map
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    // Update post comments count
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return { ...p, commentsCount: p.commentsCount + 1 };
        }
        return p;
      })
    );

    if (activeDetailPost && activeDetailPost.id === postId) {
      setActiveDetailPost((prev) => (prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null));
    }

    showToast('Comment posted 🖤');
  };

  // 6. Toggle Like on Comment
  const toggleLikeComment = (postId: string, commentId: string) => {
    setComments((prev) => {
      const postComments = prev[postId] || [];
      const updated = postComments.map((c) => {
        if (c.id === commentId) {
          const nextLiked = !c.hasLiked;
          return {
            ...c,
            hasLiked: nextLiked,
            likesCount: nextLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
          };
        }
        return c;
      });
      return { ...prev, [postId]: updated };
    });
  };

  // 7. Share Post (Copy Link, Share to Profile / Repost, or Send in DM)
  const sharePost = async (
    postId: string,
    method: 'copy_link' | 'share_to_profile' | 'send_dm',
    recipientId?: string
  ): Promise<boolean> => {
    const post = posts.find((p) => p.id === postId) || activeDetailPost;
    if (!post) return false;

    if (method === 'copy_link') {
      const shareUrl = `${window.location.origin}/#post-${post.id}`;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
        }
        showToast('Link copied to clipboard ✨');
        return true;
      } catch {
        showToast('Link copied: ' + shareUrl);
        return true;
      }
    }

    if (method === 'share_to_profile') {
      // Repost to own profile feed
      const repostedPost: Post = {
        id: `post_repost_${Date.now()}`,
        userId: currentUser.id,
        user: currentUser,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        caption: `[Reposted from @${post.user.username}]: ${post.caption}`,
        location: post.location,
        filter: post.filter,
        aspectRatio: post.aspectRatio,
        likesCount: 1,
        hasLiked: true,
        savesCount: 0,
        hasSaved: false,
        commentsCount: 0,
        createdAt: 'Just now',
        tags: post.tags,
      };

      setPosts((prev) => [repostedPost, ...prev]);
      setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#ffffff', '#888888', '#111111', '#dddddd'],
        });
      } catch {
        // confetti safe
      }

      showToast('Shared to your profile feed! 🖤');
      return true;
    }

    if (method === 'send_dm' && recipientId) {
      // Send as DM in conversation
      const conv = conversations.find((c) => c.participant.id === recipientId);
      const postShareMessage: DirectMessage = {
        id: `msg_share_${Date.now()}`,
        conversationId: conv ? conv.id : `conv_${recipientId}`,
        senderId: currentUser.id,
        text: `Shared post from @${post.user.username}: "${post.caption.slice(0, 60)}..."`,
        mediaUrl: post.mediaUrl,
        createdAt: 'Just now',
        isRead: true,
      };

      if (conv) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conv.id
              ? { ...c, messages: [...c.messages, postShareMessage] }
              : c
          )
        );
      } else {
        const recipientUser = creators.find((u) => u.id === recipientId);
        if (recipientUser) {
          const newConv: Conversation = {
            id: `conv_${recipientId}`,
            participant: recipientUser,
            unreadCount: 0,
            messages: [postShareMessage],
          };
          setConversations((prev) => [newConv, ...prev]);
        }
      }

      showToast(`Sent post to @${recipientId} via DM 📩`);
      return true;
    }

    return false;
  };

  // 8. Toggle Follow / Unfollow
  const toggleFollow = (userId: string) => {
    let nowFollowing = false;
    let targetName = '';

    setCreators((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          nowFollowing = !u.isFollowing;
          targetName = u.username;
          return {
            ...u,
            isFollowing: nowFollowing,
            followersCount: nowFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
          };
        }
        return u;
      })
    );

    // Update currentUser following count
    setCurrentUser((prev) => ({
      ...prev,
      followingCount: nowFollowing ? prev.followingCount + 1 : Math.max(0, prev.followingCount - 1),
    }));

    showToast(nowFollowing ? `Following @${targetName} 🤍` : `Unfollowed @${targetName}`);
  };

  // 9. Create New Post
  const createPost = (postData: Partial<Post>) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      mediaUrl: postData.mediaUrl || '/src/assets/images/instaindia_palace_monochrome_1790314744265.jpg',
      mediaType: postData.mediaType || 'image',
      caption: postData.caption || '',
      location: postData.location || 'New Delhi, India',
      filter: postData.filter || 'filter-normal',
      aspectRatio: postData.aspectRatio || 'square',
      likesCount: 1,
      hasLiked: true,
      savesCount: 0,
      hasSaved: false,
      commentsCount: 0,
      createdAt: 'Just now',
      tags: postData.tags || ['#InstaIndia', '#Monochrome'],
    };

    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ffffff', '#cccccc', '#333333'],
      });
    } catch {
      // safe
    }

    showToast('Your photograph is published to InstaIndia! ✨');
    setActiveTab('feed');
  };

  // 10. Create New Story
  const createStory = (storyData: Partial<Story>) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      mediaUrl: storyData.mediaUrl || '/src/assets/images/instaindia_couture_fashion_1790314759630.jpg',
      caption: storyData.caption || '',
      createdAt: 'Just now',
      hasSeen: false,
    };

    setStories((prev) => [newStory, ...prev]);
    showToast('Story added to your profile! 🖤');
  };

  // 11. Send Direct Message (Real-time with smart creator response)
  const sendDirectMessage = (conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newMsg: DirectMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      text: trimmed,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );

    // Simulate authentic reply from creator after 1.5s
    const targetConv = conversations.find((c) => c.id === conversationId);
    if (targetConv && targetConv.participant.id !== currentUser.id) {
      setTimeout(() => {
        const creatorName = targetConv.participant.fullName.split(' ')[0];
        const replies = [
          `Thank you for reaching out Rajni! Appreciate your eye for monochrome details 🖤`,
          `Delighted you liked the latest archive! Are you visiting Mumbai for art week?`,
          `Namaste! Working on new silver zari prints right now. Will share a preview with you soon. ✨`,
          `Absolutely! Let's collaborate on the upcoming heritage feature for InstaIndia.`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg: DirectMessage = {
          id: `msg_reply_${Date.now()}`,
          conversationId,
          senderId: targetConv.participant.id,
          text: `${randomReply} — ${creatorName}`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, replyMsg],
                  unreadCount: activeConversationId === conversationId ? 0 : c.unreadCount + 1,
                }
              : c
          )
        );
      }, 1600);
    }
  };

  // 12. Update User Profile
  const updateUserProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
    showToast('Profile updated seamlessly');
  };

  // 13. Mark Notifications Read
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        creators,
        posts,
        reels,
        stories,
        comments,
        conversations,
        notifications,
        activeTab,
        setActiveTab,
        activeStoryIndex,
        setActiveStoryIndex,
        activeCommentPostId,
        setActiveCommentPostId,
        activeSharePost,
        setActiveSharePost,
        activeDetailPost,
        setActiveDetailPost,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        activeConversationId,
        setActiveConversationId,
        toastMessage,
        showToast,
        toggleLikePost,
        toggleLikeReel,
        toggleSavePost,
        toggleSaveReel,
        addComment,
        toggleLikeComment,
        sharePost,
        toggleFollow,
        createPost,
        createStory,
        sendDirectMessage,
        updateUserProfile,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
