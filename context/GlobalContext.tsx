
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Story, User, Reel, Notification } from '../types';
import { 
  dbLogin, dbSignup, dbLogout, dbGetCurrentUser, dbUpdateUser,
  dbCreatePost, dbGetPosts, dbToggleLike, dbAddComment,
  dbCreateReel, dbGetReels, dbToggleFollow as dbToggleFollowService,
  dbCreateNotification, dbGetNotifications, dbMarkNotificationsRead
} from '../services/dbService';
import { uploadToCloudinary } from '../services/cloudinaryService';

interface GlobalContextType {
  currentUser: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, handle: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  
  posts: Post[];
  stories: Story[];
  reels: Reel[];
  notifications: Notification[];
  followingIds: Set<string>;
  
  addPost: (caption: string, imageFile: File, song?: string) => Promise<void>;
  addStory: (imageFile: File) => Promise<void>;
  addReel: (caption: string, file: File, song: string) => Promise<void>;
  deleteStory: (storyId: string) => void;
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  
  // Interactions
  togglePostLike: (postId: string) => void;
  togglePostSave: (postId: string) => void;
  commentOnPost: (postId: string, text: string) => void;
  shareContent: (type: 'post' | 'reel', id: string) => void;
  toggleReelLike: (reelId: string) => void;
  toggleReelSave: (reelId: string) => void;
  commentOnReel: (reelId: string) => void;
  refreshData: () => void;
  markNotificationsRead: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const INITIAL_USER_TEMPLATE: User = {
  id: '',
  name: '',
  handle: '',
  email: '',
  avatar: 'https://picsum.photos/100/100?random=999',
  followers: [],
  following: []
};

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER_TEMPLATE);
  const [isLoading, setIsLoading] = useState(true);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set()); 

  // --- Initialization ---
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    setIsLoading(true);
    const user = await dbGetCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setFollowingIds(new Set(user.following));
    }
    setIsLoading(false);
  };

  const refreshData = async () => {
    const fetchedPosts = await dbGetPosts();
    // Sort by new
    setPosts(fetchedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    
    const fetchedReels = await dbGetReels();
    setReels(fetchedReels);

    const fetchedNotifs = await dbGetNotifications(currentUser.id);
    setNotifications(fetchedNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  // --- Auth Actions ---
  const login = async (email: string, pass: string) => {
    try {
      const user = await dbLogin(email, pass);
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      alert("Login failed: " + (error as Error).message);
    }
  };

  const signup = async (name: string, handle: string, email: string, pass: string) => {
    try {
      const user = await dbSignup(name, handle, email, pass);
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      alert("Signup failed: " + (error as Error).message);
    }
  };

  const logout = () => {
    dbLogout();
    setIsAuthenticated(false);
    setCurrentUser(INITIAL_USER_TEMPLATE);
  };

  const updateProfile = async (data: Partial<User>) => {
      const updatedUser = await dbUpdateUser(currentUser.id, data);
      setCurrentUser(updatedUser);
  };

  // --- Content Actions ---
  const addPost = async (caption: string, imageFile: File, song?: string) => {
    const imageUrl = await uploadToCloudinary(imageFile);
    await dbCreatePost(currentUser.id, caption, imageUrl, song);
    refreshData();
  };

  const addStory = async (imageFile: File) => {
    // Basic implementation for story in memory (as DB service doesn't have stories fully implemented yet)
    const imageUrl = URL.createObjectURL(imageFile);
    const newStory: Story = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      imageUrl,
      isViewed: false,
      createdAt: new Date().toISOString()
    };
    setStories(prev => [newStory, ...prev]);
  };

  const addReel = async (caption: string, file: File, song: string) => {
    let mediaUrl = '';
    const isVideo = file.type.startsWith('video/');
    
    // Check if it's already a blob url (from AI generation)
    if (file.name === 'generated_video.mp4') {
        mediaUrl = URL.createObjectURL(file);
    } else {
        mediaUrl = await uploadToCloudinary(file);
    }
    
    await dbCreateReel(currentUser.id, caption, mediaUrl, song, isVideo);
    refreshData();
  };

  const deleteStory = (storyId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId));
  };

  const toggleFollow = async (targetUserId: string) => {
    // Optimistic UI
    setFollowingIds(prev => {
      const next = new Set(prev);
      if (next.has(targetUserId)) {
        next.delete(targetUserId);
      } else {
        next.add(targetUserId);
      }
      return next;
    });

    const isNowFollowing = await dbToggleFollowService(currentUser.id, targetUserId);
    if (isNowFollowing) {
        await dbCreateNotification(targetUserId, currentUser.id, 'FOLLOW');
    }
  };

  const isFollowing = (userId: string) => followingIds.has(userId);

  // --- Interactions ---
  const togglePostLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    
    // Optimistic Update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.likes.includes(currentUser.id);
        const newLikes = isLiked 
            ? p.likes.filter(id => id !== currentUser.id)
            : [...p.likes, currentUser.id];
        return { ...p, likes: newLikes, isLiked: !isLiked };
      }
      return p;
    }));
    
    await dbToggleLike(currentUser.id, postId, 'post');

    // Create Notification if liked (and not self)
    if (post && !post.likes.includes(currentUser.id) && post.userId !== currentUser.id) {
        await dbCreateNotification(post.userId, currentUser.id, 'LIKE', postId, post.imageUrl);
    }
  };

  const togglePostSave = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isSaved: !p.isSaved };
      }
      return p;
    }));
  };

  const commentOnPost = async (postId: string, text: string = "") => {
    if (!text) return;
    
    const post = posts.find(p => p.id === postId);

    await dbAddComment(currentUser.id, postId, text);
    
    // Create Notification if not self
    if (post && post.userId !== currentUser.id) {
        await dbCreateNotification(post.userId, currentUser.id, 'COMMENT', postId, text);
    }
    
    refreshData();
  };

  const toggleReelLike = async (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const isLiked = r.likes.includes(currentUser.id);
        const newLikes = isLiked 
            ? r.likes.filter(id => id !== currentUser.id)
            : [...r.likes, currentUser.id];
        return { ...r, likes: newLikes, isLiked: !isLiked };
      }
      return r;
    }));
    await dbToggleLike(currentUser.id, reelId, 'reel');
  };

  const toggleReelSave = (reelId: string) => {
    setReels(prev => prev.map(r => {
        if (r.id === reelId) {
            return { ...r, isSaved: !r.isSaved };
        }
        return r;
    }));
  };

  const commentOnReel = (reelId: string) => {
     setReels(prev => prev.map(r => {
        if (r.id === reelId) {
            return { ...r, comments: r.comments + 1 };
        }
        return r;
     }));
  };

  const shareContent = async (type: 'post' | 'reel', id: string) => {
    const url = `${window.location.origin}/${type}/${id}`;
    const title = type === 'post' ? 'Check out this post on Orion' : 'Check out this reel on Orion';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: title,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const markNotificationsRead = async () => {
      await dbMarkNotificationsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  };

  return (
    <GlobalContext.Provider value={{
      currentUser,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
      posts,
      stories,
      reels,
      notifications,
      followingIds,
      addPost,
      addStory,
      addReel,
      deleteStory,
      toggleFollow,
      isFollowing,
      togglePostLike,
      togglePostSave,
      commentOnPost,
      shareContent,
      toggleReelLike,
      toggleReelSave,
      commentOnReel,
      refreshData,
      markNotificationsRead
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
};
