import React from 'react';
import { Home, Search, PlusCircle, Video, User, Settings, LogOut, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCall = location.pathname === '/call';
  const isChatDetail = location.pathname.includes('/chat/');
  
  // Hide completely on Call screen
  if (isCall) return null;

  // Navigation Items
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Search, path: '/search', label: 'Search' },
    { icon: Video, path: '/reels', label: 'Reels' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  // Mobile Bottom Nav
  const MobileNav = () => {
    // Hide mobile nav on Chat Detail for immersion
    if (isChatDetail) return null;

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/95 to-transparent pb-4 pt-2 px-6 flex justify-between items-center z-50">
        <button 
          onClick={() => navigate('/')}
          className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/' ? 'text-pink-500 scale-110' : 'text-gray-400 hover:text-white'}`}
        >
          <Home size={26} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
        </button>
        
        <button 
          onClick={() => navigate('/search')}
          className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/search' ? 'text-pink-500 scale-110' : 'text-gray-400 hover:text-white'}`}
        >
          <Search size={26} strokeWidth={location.pathname === '/search' ? 2.5 : 2} />
        </button>
        
        <button 
          onClick={() => navigate('/create')}
          className="relative -top-4 shadow-[0_0_15px_rgba(236,72,153,0.6)] group"
        >
          <div className="absolute inset-0 bg-pink-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <PlusCircle size={56} className="text-pink-500 bg-black rounded-full relative z-10" fill="black" />
        </button>

        <button 
          onClick={() => navigate('/reels')}
          className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/reels' ? 'text-pink-500 scale-110' : 'text-gray-400 hover:text-white'}`}
        >
          <Video size={26} strokeWidth={location.pathname === '/reels' ? 2.5 : 2} />
        </button>
        
        <button 
          onClick={() => navigate('/profile')}
          className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/profile' ? 'text-pink-500 scale-110' : 'text-gray-400 hover:text-white'}`}
        >
          <User size={26} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
        </button>
      </div>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => {
    return (
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 lg:w-64 flex-col bg-black/50 backdrop-blur-xl border-r border-white/10 z-50 pt-8 pb-6 px-4 justify-between transition-all duration-300">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start lg:px-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center lg:hidden">
               <span className="font-bold text-white">O</span>
             </div>
             <h1 className="hidden lg:block text-2xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
               ORION
             </h1>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                    isActive ? 'bg-white/10 text-pink-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && <div className="absolute inset-0 bg-pink-500 blur opacity-20"></div>}
                  </div>
                  <span className={`hidden lg:block font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                </button>
              );
            })}

            {/* Create Post for Desktop */}
             <button
              onClick={() => navigate('/create')}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                location.pathname === '/create' ? 'bg-white/10 text-pink-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <PlusCircle size={24} />
              <span className="hidden lg:block font-medium">Create</span>
            </button>
            
            {/* Chats Link explicit for Desktop */}
            <button
              onClick={() => navigate('/chats')}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                location.pathname.includes('/chat') ? 'bg-white/10 text-pink-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Menu size={24} />
              <span className="hidden lg:block font-medium">Messages</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings size={24} />
            <span className="hidden lg:block font-medium">Settings</span>
          </button>
          
          <div className="pt-4 border-t border-white/10 flex items-center gap-3 justify-center lg:justify-start">
             <img src="https://picsum.photos/100/100?random=1" alt="Profile" className="w-10 h-10 rounded-full border border-pink-500/50" />
             <div className="hidden lg:block overflow-hidden">
                <p className="text-sm font-bold truncate">starlight</p>
                <p className="text-xs text-gray-400 truncate">@andromeda</p>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <MobileNav />
      <DesktopSidebar />
    </>
  );
};