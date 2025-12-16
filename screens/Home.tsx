
import React, { useRef, useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Bell, Plus, Trash2, X, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';
import { Story } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { 
    posts, 
    stories, 
    currentUser, 
    addStory, 
    deleteStory, 
    isFollowing, 
    toggleFollow,
    togglePostLike,
    togglePostSave,
    commentOnPost,
    shareContent,
    notifications
  } = useGlobal();
  
  const storyInputRef = useRef<HTMLInputElement>(null);
  
  // State for viewing a story
  const [viewingStory, setViewingStory] = useState<Story | null>(null);

  // State for comments
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const myStory = stories.find(s => s.user?.id === currentUser.id);
  const otherStories = stories.filter(s => s.user?.id !== currentUser.id);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleStoryClick = (story?: Story) => {
    if (story) {
      setViewingStory(story);
    } else {
      // Trigger upload if clicking "My Story" and no story exists
      storyInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addStory(e.target.files[0]);
    }
  };

  const handleDeleteStory = () => {
    if (viewingStory) {
      deleteStory(viewingStory.id);
      setViewingStory(null);
    }
  };

  const handlePostComment = async () => {
    if (!activeCommentPostId || !commentText.trim()) return;
    await commentOnPost(activeCommentPostId, commentText);
    setCommentText('');
  };

  const formatNumber = (num: number) => {
      if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'k';
      }
      return num.toString();
  };

  const activePost = posts.find(p => p.id === activeCommentPostId);

  return (
    <div className="pb-24 pt-14 md:pt-6 min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#0f0c29] to-black">
      {/* Hidden Input for Story Upload */}
      <input type="file" ref={storyInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* Comment Modal */}
      {activeCommentPostId && activePost && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center">
            <div 
                className="bg-[#1a0b2e] w-full md:max-w-md h-[70vh] md:h-[80vh] md:rounded-2xl rounded-t-3xl flex flex-col border border-white/10 shadow-2xl relative animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-white">Comments</h3>
                    <button onClick={() => setActiveCommentPostId(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
                </div>
                
                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                    {activePost.comments && activePost.comments.length > 0 ? (
                        activePost.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <img src={comment.user?.avatar || "https://picsum.photos/50/50"} className="w-8 h-8 rounded-full object-cover" />
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <span className="font-bold mr-2 text-white">{comment.user?.name || "User"}</span>
                                        <span className="text-gray-300">{comment.text}</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <MessageCircle size={32} className="mb-2 opacity-50"/>
                            <p>No comments yet.</p>
                            <p className="text-xs">Start the conversation.</p>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-3 border-t border-white/10 bg-[#1a0b2e] flex items-center gap-3 md:rounded-b-2xl">
                    <img src={currentUser.avatar} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1 relative">
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-colors"
                            placeholder={`Comment as ${currentUser.name}...`}
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handlePostComment()}
                            autoFocus
                        />
                        <button 
                            onClick={handlePostComment}
                            disabled={!commentText.trim()}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${commentText.trim() ? 'text-pink-500 hover:bg-pink-500/10' : 'text-gray-500'}`}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Close on click outside (background) */}
            <div className="absolute inset-0 -z-10" onClick={() => setActiveCommentPostId(null)}></div>
        </div>
      )}

      {/* Story Viewer Overlay */}
      {viewingStory && viewingStory.user && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center">
           <div className="relative w-full h-full md:max-w-md md:h-[90vh] md:rounded-2xl overflow-hidden">
              <img src={viewingStory.imageUrl} className="w-full h-full object-cover" alt="Story" />
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <img src={viewingStory.user.avatar} className="w-8 h-8 rounded-full" />
                    <span className="text-white font-semibold">{viewingStory.user.name}</span>
                 </div>
                 <button onClick={() => setViewingStory(null)} className="text-white p-2"><X size={24} /></button>
              </div>
              
              {/* Delete button if it's my story */}
              {viewingStory.user.id === currentUser.id && (
                <button 
                  onClick={handleDeleteStory}
                  className="absolute bottom-8 right-8 bg-red-500/80 p-3 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={24} />
                </button>
              )}
           </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-40 bg-opacity-80 backdrop-blur-md bg-[#1a0b2e] px-4 py-3 flex justify-between items-center border-b border-white/5">
        <h1 className="text-2xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          ORION
        </h1>
        <div className="flex gap-4">
          <Send className="text-white transform -rotate-45 cursor-pointer" onClick={() => navigate('/chats')} />
          <div className="relative cursor-pointer" onClick={() => navigate('/notifications')}>
             <Bell className="text-white" />
             {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border border-black"></div>}
          </div>
        </div>
      </div>

      {/* Desktop Header / Tools */}
      <div className="hidden md:flex justify-end px-8 py-4 mb-4 gap-6 items-center max-w-2xl mx-auto w-full">
         <div className="relative cursor-pointer" onClick={() => navigate('/notifications')}>
           <Bell className="text-gray-300 hover:text-white" />
           {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border border-[#1a0b2e]"></div>}
         </div>
         <Send className="text-gray-300 hover:text-white transform -rotate-45 cursor-pointer" onClick={() => navigate('/chats')} />
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {/* Stories */}
        <div className="flex gap-4 overflow-x-auto px-4 py-2 no-scrollbar mb-6">
          
          {/* My Story Bubble */}
          <div className="flex flex-col items-center gap-1 min-w-[80px] cursor-pointer group" onClick={() => handleStoryClick(myStory)}>
            <div className={`relative p-[3px] rounded-full transition-transform duration-300 group-hover:scale-105 ${myStory ? 'bg-gradient-to-tr from-pink-500 to-purple-600' : 'bg-gray-700'}`}>
              <div className="p-[2px] bg-black rounded-full relative">
                <img src={currentUser.avatar} alt="Me" className={`w-16 h-16 rounded-full object-cover ${!myStory && 'opacity-50'}`} />
                {!myStory && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Plus size={24} className="text-white" />
                  </div>
                )}
              </div>
              {myStory && (
                <div className="absolute bottom-0 right-0 bg-blue-500 text-[10px] text-white px-1 rounded-full border border-black">
                   My
                </div>
              )}
            </div>
            <span className="text-xs text-gray-300 truncate w-full text-center group-hover:text-white">Your Story</span>
          </div>

          {/* Other Stories */}
          {otherStories.map((story) => (
            story.user && (
            <div key={story.id} className="flex flex-col items-center gap-1 min-w-[80px] cursor-pointer group" onClick={() => handleStoryClick(story)}>
              <div className={`p-[3px] rounded-full transition-transform duration-300 group-hover:scale-105 ${story.isViewed ? 'bg-gray-600' : 'bg-gradient-to-tr from-pink-500 to-purple-600'}`}>
                <div className="p-[2px] bg-black rounded-full">
                  <img src={story.user.avatar} alt={story.user.name} className="w-16 h-16 rounded-full object-cover" />
                </div>
              </div>
              <span className="text-xs text-gray-300 truncate w-full text-center group-hover:text-white">{story.user.name}</span>
            </div>
            )
          ))}
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-8 px-4">
          {posts.map((post) => (
            post.user && (
            <div key={post.id} className="bg-white/5 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10 shadow-xl">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer">
                  <img src={post.user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-purple-500/30" />
                  <div>
                    <h3 className="font-semibold text-sm hover:text-pink-400 transition-colors">{post.user.name}</h3>
                    <p className="text-xs text-purple-300">{post.user.handle}</p>
                    {/* Song Tag */}
                    {post.song && (
                      <div className="flex items-center gap-1 text-[10px] text-pink-400 mt-0.5">
                         <Music size={10} />
                         <span className="truncate max-w-[150px]">{post.song}</span>
                      </div>
                    )}
                  </div>
                </div>
                {post.user.id !== currentUser.id && (
                    <button 
                      onClick={() => toggleFollow(post.user!.id)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${isFollowing(post.user.id) ? 'border-white/30 text-gray-300' : 'border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white'}`}
                    >
                      {isFollowing(post.user.id) ? 'Following' : 'Follow'}
                    </button>
                )}
              </div>
              
              <div className="relative group cursor-pointer" onDoubleClick={() => togglePostLike(post.id)}>
                 <img src={post.imageUrl} alt="Post" className="w-full h-auto max-h-[600px] object-cover" />
                 {/* Double click heart animation could be added here */}
              </div>

              <div className="p-4">
                <div className="flex justify-between mb-4">
                  <div className="flex gap-6">
                    <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => togglePostLike(post.id)}
                    >
                      <Heart className={`w-7 h-7 transition-colors ${post.isLiked ? 'text-pink-500 fill-pink-500' : 'text-white group-hover:text-pink-500'}`} />
                      <span className="text-sm font-medium">{formatNumber(post.likes.length)}</span>
                    </div>
                    <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => setActiveCommentPostId(post.id)}
                    >
                      <MessageCircle className="w-7 h-7 text-white group-hover:text-blue-400 transition-colors" />
                      <span className="text-sm font-medium">{formatNumber(post.comments.length)}</span>
                    </div>
                    <Send 
                        className="w-7 h-7 text-white transform -rotate-45 hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer hover:text-pink-400" 
                        onClick={() => shareContent('post', post.id)}
                    />
                  </div>
                  <Bookmark 
                    className={`w-7 h-7 transition-colors cursor-pointer ${post.isSaved ? 'text-yellow-400 fill-yellow-400' : 'text-white hover:text-yellow-400'}`} 
                    onClick={() => togglePostSave(post.id)}
                  />
                </div>
                
                <div className="mb-2">
                  <span className="font-semibold mr-2 hover:underline cursor-pointer">{post.user.name}</span>
                  <span className="text-gray-300 text-sm leading-relaxed">{post.caption}</span>
                </div>
                <div 
                    className="mt-2 text-xs text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-300"
                    onClick={() => setActiveCommentPostId(post.id)}
                >
                  View all {formatNumber(post.comments.length)} comments • {post.timeAgo}
                </div>
              </div>
            </div>
            )
          ))}
          {posts.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                  No posts yet. Be the first to explore! 🌌
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
