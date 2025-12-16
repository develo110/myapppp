
import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Music, Bookmark } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

export const Reels: React.FC = () => {
  const { 
    toggleFollow, 
    isFollowing, 
    reels,
    toggleReelLike,
    toggleReelSave,
    commentOnReel,
    shareContent
  } = useGlobal();

  const formatNumber = (num: number) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="h-screen w-full bg-black flex justify-center overflow-hidden">
      <div className="w-full md:w-[400px] h-full relative shadow-2xl overflow-y-scroll snap-y snap-mandatory no-scrollbar md:border-x md:border-white/10">
        {reels.map((reel) => (
          <div key={reel.id} className="h-screen w-full relative snap-start bg-gray-900">
            {reel.isVideo ? (
              <video 
                src={reel.videoUrl} 
                className="h-full w-full object-cover" 
                autoPlay 
                loop 
                muted 
                playsInline 
              />
            ) : (
              <img src={reel.videoUrl} alt="Reel" className="h-full w-full object-cover" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>
            
            {/* Header Overlay - Mobile Only */}
            <div className="md:hidden absolute top-4 left-4 right-4 flex justify-between items-center z-10 text-white pointer-events-auto">
               <h1 className="text-xl font-bold tracking-widest text-pink-500">ORION</h1>
            </div>

            {/* Right Side Actions */}
            <div className="absolute bottom-24 right-4 flex flex-col items-center gap-6 z-20 pointer-events-auto">
               <div 
                 className="flex flex-col items-center gap-1 cursor-pointer group"
                 onClick={() => toggleReelLike(reel.id)}
               >
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-colors">
                     <Heart className={`w-6 h-6 transform group-hover:scale-110 transition-transform ${reel.isLiked ? 'text-pink-500 fill-pink-500' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-xs font-medium">{formatNumber(reel.likes.length)}</span>
               </div>
               
               <div 
                 className="flex flex-col items-center gap-1 cursor-pointer group"
                 onClick={() => commentOnReel(reel.id)}
               >
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-colors">
                     <MessageCircle className="text-white w-6 h-6 transform group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-white text-xs font-medium">{formatNumber(reel.comments)}</span>
               </div>

               <div 
                 className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
                 onClick={() => toggleReelSave(reel.id)}
               >
                  <Bookmark className={`w-6 h-6 ${reel.isSaved ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
               </div>

               <div 
                 className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
                 onClick={() => shareContent('reel', reel.id)}
               >
                  <Share2 className="text-white w-6 h-6" />
               </div>
               
               <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                  <MoreHorizontal className="text-white w-6 h-6" />
               </div>
               
               <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden animate-spin-slow">
                   <img src={reel.userAvatar || "https://picsum.photos/50/50?random=1"} className="w-full h-full object-cover" />
               </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-24 left-4 z-20 max-w-[75%] pointer-events-auto">
               <div className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80">
                  <img src={reel.userAvatar || `https://picsum.photos/50/50?random=${reel.id}`} className="w-8 h-8 rounded-full border border-white" />
                  <span className="text-white font-semibold shadow-black drop-shadow-md">{reel.user}</span>
                  {reel.userId !== 'me' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFollow(reel.userId); }}
                      className={`px-2 py-0.5 border rounded-md text-xs text-white transition-colors ${isFollowing(reel.userId) ? 'bg-white/20 border-white/50' : 'border-white/50 hover:bg-white/20'}`}
                    >
                      {isFollowing(reel.userId) ? 'Following' : 'Follow'}
                    </button>
                  )}
               </div>
               <p className="text-white text-sm mb-2 drop-shadow-md">{reel.desc}</p>
               <div className="flex items-center gap-2 text-white/80 text-xs">
                  <Music size={12} />
                  <span>{reel.song}</span>
               </div>
            </div>
          </div>
        ))}
        {reels.length === 0 && (
            <div className="h-screen w-full flex items-center justify-center text-gray-500">
                No Reels available.
            </div>
        )}
      </div>
    </div>
  );
};
