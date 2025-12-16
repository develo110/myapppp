
import { User, Post, Reel, Story, Comment, Notification } from '../types';

/**
 * SIMULATED MONGODB DATABASE
 * Stores data in localStorage to persist across reloads.
 * 
 * Note: The provided MONGO_URL cannot be used securely in a client-side application.
 * Ideally, this logic would live on a Node.js backend using the connection string:
 * mongodb+srv://rohmananisur680_db_user:gikE7MI61RqeLJwq@cluster0.ywvvxul.mongodb.net/?appName=Cluster0
 */

const STORAGE_KEYS = {
  USERS: 'orion_users',
  POSTS: 'orion_posts',
  REELS: 'orion_reels',
  STORIES: 'orion_stories',
  NOTIFICATIONS: 'orion_notifications',
  AUTH: 'orion_auth_token',
};

// --- Helpers ---
const getCollection = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveCollection = (key: string, data: any[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Auth ---
export const dbLogin = async (email: string, pass: string): Promise<User> => {
  const users = getCollection<User>(STORAGE_KEYS.USERS);
  
  // Find user by email
  const user = users.find(u => u.email === email);
  
  // Verify user exists and password matches
  if (!user || user.password !== pass) {
    throw new Error('Invalid email or password');
  }
  
  localStorage.setItem(STORAGE_KEYS.AUTH, user.id);
  
  // Return user without password for state
  const { password, ...safeUser } = user;
  return safeUser as User;
};

export const dbSignup = async (name: string, handle: string, email: string, pass: string): Promise<User> => {
  const users = getCollection<User>(STORAGE_KEYS.USERS);
  
  if (users.find(u => u.email === email)) throw new Error('Email already exists');
  
  const newUser: User = {
    id: generateId(),
    name,
    handle: handle.startsWith('@') ? handle : `@${handle}`,
    email,
    password: pass, // Store password
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, // Default avatar
    cover: 'https://picsum.photos/800/300?grayscale&blur=2',
    followers: [],
    following: [],
    bio: 'New to Orion 🌌',
  };

  users.push(newUser);
  saveCollection(STORAGE_KEYS.USERS, users);
  localStorage.setItem(STORAGE_KEYS.AUTH, newUser.id);
  
  // Return user without password for state
  const { password, ...safeUser } = newUser;
  return safeUser as User;
};

export const dbLogout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};

export const dbGetCurrentUser = async (): Promise<User | null> => {
  const userId = localStorage.getItem(STORAGE_KEYS.AUTH);
  if (!userId) return null;
  const users = getCollection<User>(STORAGE_KEYS.USERS);
  const user = users.find(u => u.id === userId);
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser as User;
};

export const dbUpdateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error("User not found");
    
    // Merge updates
    users[index] = { ...users[index], ...updates };
    saveCollection(STORAGE_KEYS.USERS, users);
    
    const { password, ...safeUser } = users[index];
    return safeUser as User;
};

// --- Users ---
export const dbGetUser = (userId: string): User | undefined => {
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.id === userId);
    if (!user) return undefined;
    const { password, ...safeUser } = user;
    return safeUser as User;
};

export const dbToggleFollow = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    const currentUserIndex = users.findIndex(u => u.id === currentUserId);
    const targetUserIndex = users.findIndex(u => u.id === targetUserId);

    if (currentUserIndex === -1 || targetUserIndex === -1) return false;

    let isFollowing = false;

    // Update current user's following list
    if (users[currentUserIndex].following.includes(targetUserId)) {
        users[currentUserIndex].following = users[currentUserIndex].following.filter(id => id !== targetUserId);
    } else {
        users[currentUserIndex].following.push(targetUserId);
        isFollowing = true;
    }

    // Update target user's followers list
    if (users[targetUserIndex].followers.includes(currentUserId)) {
        users[targetUserIndex].followers = users[targetUserIndex].followers.filter(id => id !== currentUserId);
    } else {
        users[targetUserIndex].followers.push(currentUserId);
    }

    saveCollection(STORAGE_KEYS.USERS, users);
    return isFollowing;
};

// --- Posts ---
export const dbCreatePost = async (userId: string, caption: string, imageUrl: string, song?: string): Promise<Post> => {
  const posts = getCollection<Post>(STORAGE_KEYS.POSTS);
  const newPost: Post = {
    id: generateId(),
    userId,
    caption,
    imageUrl,
    song,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };
  posts.unshift(newPost); // Add to top
  saveCollection(STORAGE_KEYS.POSTS, posts);
  return newPost;
};

export const dbGetPosts = async (): Promise<Post[]> => {
  const posts = getCollection<Post>(STORAGE_KEYS.POSTS);
  const users = getCollection<User>(STORAGE_KEYS.USERS);
  
  // "Populate" user data (MongoDB aggregation simulation)
  return posts.map(post => {
    const user = users.find(u => u.id === post.userId);
    const safeUser = user ? (({ password, ...u }) => u)(user) : { id: 'unknown', name: 'Unknown', handle: '@unknown', avatar: '', email: '', followers: [], following: [] } as User;
    
    // Hydrate comments with user data
    const hydratedComments = (post.comments || []).map(comment => {
        const commentUser = users.find(u => u.id === comment.userId);
        const safeCommentUser = commentUser ? (({ password, ...u }) => u)(commentUser) : undefined;
        return {
            ...comment,
            user: safeCommentUser
        };
    });

    return {
      ...post,
      user: safeUser,
      comments: hydratedComments,
      timeAgo: getTimeAgo(post.createdAt)
    };
  });
};

export const dbToggleLike = async (currentUserId: string, contentId: string, type: 'post' | 'reel') => {
    const key = type === 'post' ? STORAGE_KEYS.POSTS : STORAGE_KEYS.REELS;
    const items = getCollection<any>(key);
    const item = items.find(i => i.id === contentId);
    
    if (item) {
        if (item.likes.includes(currentUserId)) {
            item.likes = item.likes.filter((id: string) => id !== currentUserId);
        } else {
            item.likes.push(currentUserId);
        }
        saveCollection(key, items);
    }
};

export const dbAddComment = async (currentUserId: string, postId: string, text: string) => {
    const posts = getCollection<Post>(STORAGE_KEYS.POSTS);
    const post = posts.find(p => p.id === postId);
    if (post) {
        const comment: Comment = {
            id: generateId(),
            userId: currentUserId,
            text,
            createdAt: new Date().toISOString()
        };
        post.comments.push(comment);
        saveCollection(STORAGE_KEYS.POSTS, posts);
    }
};

// --- Reels ---
export const dbCreateReel = async (userId: string, desc: string, videoUrl: string, song: string, isVideo: boolean): Promise<Reel> => {
    const reels = getCollection<Reel>(STORAGE_KEYS.REELS);
    const newReel: Reel = {
        id: generateId(),
        userId,
        desc,
        videoUrl,
        song,
        isVideo,
        likes: [],
        comments: 0
    };
    reels.unshift(newReel);
    saveCollection(STORAGE_KEYS.REELS, reels);
    return newReel;
};

export const dbGetReels = async (): Promise<Reel[]> => {
    const reels = getCollection<Reel>(STORAGE_KEYS.REELS);
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    
    return reels.map(reel => {
        const user = users.find(u => u.id === reel.userId);
        return {
            ...reel,
            user: user?.name || 'Unknown',
            userAvatar: user?.avatar || ''
        };
    });
};

// --- Notifications ---
export const dbCreateNotification = async (
  recipientId: string, 
  senderId: string, 
  type: 'LIKE' | 'COMMENT' | 'FOLLOW',
  contentId?: string,
  preview?: string
) => {
    // Don't notify self
    if (recipientId === senderId) return;

    const notifs = getCollection<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    
    // Check for duplicate likes to avoid spamming
    if (type === 'LIKE') {
        const exists = notifs.find(n => 
            n.recipientId === recipientId && 
            n.senderId === senderId && 
            n.type === 'LIKE' && 
            n.contentId === contentId
        );
        if (exists) return; 
    }

    const newNotif: Notification = {
        id: generateId(),
        recipientId,
        senderId,
        type,
        contentId,
        preview,
        isRead: false,
        createdAt: new Date().toISOString()
    };

    notifs.unshift(newNotif);
    saveCollection(STORAGE_KEYS.NOTIFICATIONS, notifs);
};

export const dbGetNotifications = async (userId: string): Promise<Notification[]> => {
    const notifs = getCollection<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const users = getCollection<User>(STORAGE_KEYS.USERS);
    
    // Filter for user and populate sender
    const userNotifs = notifs.filter(n => n.recipientId === userId);
    
    return userNotifs.map(n => {
        const sender = users.find(u => u.id === n.senderId);
        const safeSender = sender ? (({ password, ...u }) => u)(sender) : undefined;
        return {
            ...n,
            sender: safeSender,
            timeAgo: getTimeAgo(n.createdAt)
        };
    });
};

export const dbMarkNotificationsRead = async (userId: string) => {
    const notifs = getCollection<Notification>(STORAGE_KEYS.NOTIFICATIONS);
    const updatedNotifs = notifs.map(n => {
        if (n.recipientId === userId) {
            return { ...n, isRead: true };
        }
        return n;
    });
    saveCollection(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
};

// --- Utils ---
function getTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
}
