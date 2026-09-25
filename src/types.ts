export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  location?: string;
  filter?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  likesCount: number;
  hasLiked: boolean;
  savesCount: number;
  hasSaved: boolean;
  commentsCount: number;
  createdAt: string;
  tags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  user: User;
  text: string;
  createdAt: string;
  likesCount: number;
  hasLiked?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  caption?: string;
  createdAt: string;
  hasSeen?: boolean;
}

export interface Reel {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  musicTitle: string;
  musicArtist: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  hasLiked: boolean;
  hasSaved: boolean;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
  mediaUrl?: string;
}

export interface Conversation {
  id: string;
  participant: User;
  messages: DirectMessage[];
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'save';
  actor: User;
  post?: Post;
  text: string;
  createdAt: string;
  isRead: boolean;
}
