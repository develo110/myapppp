
export interface User {
  id: string;
  name: string;
  handle: string;
  email: string; // Added for auth
  password?: string; // Added for authentication validation
  avatar: string;
  cover?: string; // Added for profile cover
  bio?: string;
  isOnline?: boolean;
  followers: string[]; // Array of User IDs
  following: string[]; // Array of User IDs
}

export interface Post {
  id: string;
  userId: string; // Reference to User
  user?: User; // Hydrated user object for UI
  imageUrl: string;
  caption: string;
  song?: string; // Added for music tagging
  likes: string[]; // Array of User IDs
  comments: Comment[];
  createdAt: string; // ISO String
  timeAgo?: string; // Calculated
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user?: User;
  text: string;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  user?: User;
  imageUrl: string;
  isViewed: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  reactions?: string[];
}

export interface ChatPreview {
  id: string;
  user: User;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

export interface Reel {
  id: string;
  userId: string;
  user?: string; // Hydrated name
  userAvatar?: string; // Hydrated avatar
  desc: string;
  song: string;
  likes: string[]; // IDs
  comments: number;
  videoUrl: string; 
  isVideo: boolean;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  sender?: User; // Hydrated
  type: 'LIKE' | 'COMMENT' | 'FOLLOW';
  contentId?: string; // Post ID or Reel ID
  preview?: string; // Comment text or image URL
  isRead: boolean;
  createdAt: string;
  timeAgo?: string;
}
