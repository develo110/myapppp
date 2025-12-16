import React from 'react';
import { Mic, Video, Volume2, PhoneOff, FlipHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Call: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-gray-900 relative overflow-hidden">
      {/* Main Video (Remote User) */}
      <img src="https://picsum.photos/800/1200?random=3" alt="Remote User" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

      {/* Small Video (Local User) */}
      <div className="absolute top-16 right-4 w-32 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
         <img src="https://picsum.photos/300/500?random=1" alt="Me" className="w-full h-full object-cover" />
         <div className="absolute inset-0 flex items-center justify-center">
            <img src="/api/placeholder/50/50" className="opacity-0" alt="" /> {/* Spacer */}
         </div>
      </div>

      {/* Floating Elements (Astronaut graphic from design) */}
      <div className="absolute top-20 left-4 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 animate-bounce">
         <span className="text-2xl">👨‍🚀</span>
      </div>

      {/* Controls Container */}
      <div className="absolute bottom-10 left-4 right-4 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex justify-between items-center px-4">
           
           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <Mic className="text-white" size={24} />
             </div>
             <span className="text-xs text-gray-300">Mute</span>
           </div>

           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <Video className="text-white" size={24} />
             </div>
             <span className="text-xs text-gray-300">Video</span>
           </div>

           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <Volume2 className="text-white" size={24} />
             </div>
             <span className="text-xs text-gray-300">Audio</span>
           </div>
           
        </div>

        <div className="flex justify-center items-center gap-8 mt-6">
           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <FlipHorizontal className="text-gray-400" size={20} />
           </div>

           <button 
             onClick={() => navigate(-1)}
             className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-105 transition-transform"
           >
              <PhoneOff className="text-white fill-white" size={32} />
           </button>

           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Effects</span>
           </div>
        </div>
      </div>
    </div>
  );
};