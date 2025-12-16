
import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Bell, Repeat, Send, Play, Camera, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';
import { uploadToCloudinary } from '../services/cloudinaryService';

const AnimatedStat = ({ value, label }: { value: number | string, label: string }) => {
  const [animating, setAnimating] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 300);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="text-center md:text-left group/stat">
      <span 
        className={`block font-bold text-lg cursor-pointer transition-all duration-300 transform ${
          animating ? 'scale-150 text-pink-500' : 'scale-100 text-white group-hover/stat:text-pink-500'
        }`}
      >
        {value}
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
};

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { posts, reels, followingIds, currentUser, updateProfile, notifications } = useGlobal();
  const [activeTab, setActiveTab] = useState<'posts' | 'video' | 'tagged'>('posts');
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [uploading, setUploading] = useState(false);

  const myPosts = posts.filter(p => p.userId === currentUser.id);
  const myReels = reels.filter(r => r.userId === currentUser.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleUpdateProfile = async () => {
      setUploading(true);
      await updateProfile({ name: editName, bio: editBio });
      setUploading(false);
      setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
      if (e.target.files && e.target.files[0]) {
          setUploading(true);
          try {
              const url = await uploadToCloudinary(e.target.files[0]);
              await updateProfile({ [type]: url });
          } catch (err) {
              alert("Failed to upload image");
          } finally {
              setUploading(false);
          }
      }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] pb-24 text-white">
      {/* Edit Profile Modal */}
      {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#1a0b2e] w-full max-w-md rounded-3xl border border-white/10 p-6 relative">
                  <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
                  <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs text-gray-400 mb-1">Display Name</label>
                          <input 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
                          />
                      </div>
                      <div>
                          <label className="block text-xs text-gray-400 mb-1">Bio</label>
                          <textarea 
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 min-h-[100px] resize-none"
                          />
                      </div>
                      <button 
                        onClick={handleUpdateProfile}
                        disabled={uploading}
                        className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                      >
                          {uploading ? 'Saving...' : 'Save Changes'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 pt-6 md:pt-8">
          <h1 className="text-xl font-bold tracking-widest text-pink-500 md:invisible">ORION</h1>
          <div className="flex gap-4">
            <Send className="transform -rotate-45 hover:text-pink-500 cursor-pointer transition-colors" size={24} />
            <div className="relative cursor-pointer" onClick={() => navigate('/notifications')}>
               <Bell size={24} className="hover:text-pink-500 transition-colors" />
               {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border border-[#0f0c29]"></div>}
            </div>
            <SettingsIcon size={24} onClick={() => navigate('/settings')} className="cursor-pointer hover:text-pink-500 transition-colors" />
          </div>
        </div>

        {/* Cover & Profile Info */}
        <div className="px-4">
          <div className="relative mb-16">
            {/* Cover Image */}
            <div className="h-32 md:h-48 w-full rounded-2xl overflow-hidden group relative bg-gray-800">
              <img src={currentUser.cover || "https://picsum.photos/800/300?grayscale"} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <label className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
                  <Camera size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} disabled={uploading} />
              </label>
            </div>
            
            {/* Avatar */}
            <div className="absolute -bottom-10 left-4 p-1 bg-[#0f0c29] rounded-full group">
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                {uploading ? (
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center border-2 border-pink-500">
                        <Loader2 className="animate-spin text-pink-500" />
                    </div>
                ) : (
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-pink-500" />
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="absolute bottom-[-30px] right-0 flex gap-2">
               <button className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><Repeat size={16} /></button>
               <button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-purple-900/50 hover:shadow-purple-900/80 transition-shadow"
               >
                   Edit Profile
               </button>
            </div>
          </div>

          <div className="mt-2 md:mt-4">
            <h2 className="text-2xl md:text-3xl font-bold">{currentUser.name}</h2>
            <p className="text-gray-400 text-sm mt-1 max-w-md">{currentUser.bio || "No bio yet."}</p>
            
            <div className="flex gap-8 mt-4">
              <AnimatedStat value={myPosts.length} label="Posts" />
              <AnimatedStat value={myReels.length} label="Reels" />
              <AnimatedStat value={followingIds.size} label="Following" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-around mt-8 border-b border-white/10 pb-0">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`font-medium pb-3 px-4 transition-colors relative ${activeTab === 'posts' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Posts
            {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.7)]" />}
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`font-medium pb-3 px-4 transition-colors relative ${activeTab === 'video' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Video
            {activeTab === 'video' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.7)]" />}
          </button>
          <button 
            onClick={() => setActiveTab('tagged')}
            className={`font-medium pb-3 px-4 transition-colors relative ${activeTab === 'tagged' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Tagged
            {activeTab === 'tagged' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.7)]" />}
          </button>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 p-1 mt-1">
           {activeTab === 'posts' && (
             <>
               {myPosts.length > 0 ? myPosts.map((post) => (
                 <div key={post.id} className="aspect-square bg-white/5 relative group cursor-pointer overflow-hidden">
                   <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors"></div>
                 </div>
               )) : (
                 <div className="col-span-full py-10 text-center text-gray-500">
                    No posts yet. Start creating!
                 </div>
               )}
             </>
           )}

           {activeTab === 'video' && (
             <>
               {myReels.length > 0 ? myReels.map((reel) => (
                 <div key={reel.id} className="aspect-[9/16] bg-white/5 relative group cursor-pointer overflow-hidden rounded-sm">
                   {reel.isVideo ? (
                       <video src={reel.videoUrl} className="w-full h-full object-cover" muted />
                   ) : (
                       <img src={reel.videoUrl} alt="Reel" className="w-full h-full object-cover" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                       <div className="flex items-center gap-1 text-xs font-bold text-white">
                           <Play size={12} className="fill-white" />
                           <span>{reel.likes.length}</span>
                       </div>
                   </div>
                 </div>
               )) : (
                 <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
                    <div className="p-4 bg-white/5 rounded-full mb-3">
                      <Play size={24} className="text-gray-400" />
                    </div>
                    <p>No reels yet.</p>
                 </div>
               )}
             </>
           )}

           {activeTab === 'tagged' && (
              <div className="col-span-full py-20 text-center text-gray-500">
                 No tagged posts yet.
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
