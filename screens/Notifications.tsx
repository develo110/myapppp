
import React, { useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationsRead } = useGlobal();

  useEffect(() => {
    markNotificationsRead();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
        case 'LIKE': return <div className="p-2 bg-pink-500/20 rounded-full"><Heart className="text-pink-500 fill-pink-500" size={20} /></div>;
        case 'COMMENT': return <div className="p-2 bg-blue-500/20 rounded-full"><MessageCircle className="text-blue-500 fill-blue-500" size={20} /></div>;
        case 'FOLLOW': return <div className="p-2 bg-purple-500/20 rounded-full"><UserPlus className="text-purple-500" size={20} /></div>;
        default: return <div className="p-2 bg-gray-500/20 rounded-full"><Heart className="text-gray-500" size={20} /></div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 sticky top-0 bg-[#0f0c29]/95 backdrop-blur-sm z-10 border-b border-white/5">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full md:hidden">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>

        <div className="flex flex-col">
           {notifications.length > 0 ? notifications.map((notif) => (
             <div 
                key={notif.id} 
                className={`flex items-center p-4 gap-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notif.isRead ? 'bg-white/5' : ''}`}
             >
                {/* User Avatar */}
                <div className="relative">
                    <img 
                        src={notif.sender?.avatar || "https://picsum.photos/100/100"} 
                        alt="User" 
                        className="w-12 h-12 rounded-full object-cover border border-white/10" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#0f0c29] rounded-full p-0.5">
                       {getIcon(notif.type)}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <p className="text-sm">
                        <span className="font-bold mr-1">{notif.sender?.name || "Unknown"}</span>
                        <span className="text-gray-300">
                            {notif.type === 'LIKE' && 'liked your post.'}
                            {notif.type === 'COMMENT' && `commented: "${notif.preview}"`}
                            {notif.type === 'FOLLOW' && 'started following you.'}
                        </span>
                    </p>
                    <span className="text-xs text-gray-500">{notif.timeAgo}</span>
                </div>

                {/* Post Preview (if applicable) */}
                {(notif.type === 'LIKE' || notif.type === 'COMMENT') && notif.preview && notif.type === 'LIKE' && (
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-800">
                        <img src={notif.preview} alt="Post" className="w-full h-full object-cover" />
                    </div>
                )}
             </div>
           )) : (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                 <div className="p-4 bg-white/5 rounded-full mb-4">
                     <Heart className="w-8 h-8 text-gray-600" />
                 </div>
                 <p>No notifications yet.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
