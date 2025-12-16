import React from 'react';
import { ArrowLeft, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatPreview } from '../types';

const MOCK_CHATS: ChatPreview[] = [
  { id: 'c1', user: { id: 'u1', name: 'astro_boy', handle: '@astro', avatar: 'https://picsum.photos/100/100?random=2', email: 'astro@example.com', followers: [], following: [] }, lastMessage: 'Your have a new message..', time: '2m', unreadCount: 1 },
  { id: 'c2', user: { id: 'u2', name: 'starlight', handle: '@star', avatar: 'https://picsum.photos/100/100?random=3', email: 'star@example.com', followers: [], following: [] }, lastMessage: 'Andromeda Galaxy', time: '1h', unreadCount: 0 },
  { id: 'c3', user: { id: 'u3', name: 'harison', handle: '@hari', avatar: 'https://picsum.photos/100/100?random=5', email: 'hari@example.com', followers: [], following: [] }, lastMessage: 'Your have a new message..', time: '3h', unreadCount: 0 },
  { id: 'c4', user: { id: 'u4', name: 'novo_gazer', handle: '@novo', avatar: 'https://picsum.photos/100/100?random=4', email: 'novo@example.com', followers: [], following: [] }, lastMessage: 'Your have a new message..', time: '24 Jan', unreadCount: 1 },
  { id: 'c5', user: { id: 'u5', name: 'your_joey', handle: '@joey', avatar: 'https://picsum.photos/100/100?random=6', email: 'joey@example.com', followers: [], following: [] }, lastMessage: 'Your have a new message..', time: '11 Jan', unreadCount: 0 },
  { id: 'c6', user: { id: 'u6', name: 'niiehoen', handle: '@niie', avatar: 'https://picsum.photos/100/100?random=7', email: 'niie@example.com', followers: [], following: [] }, lastMessage: 'Greatv linov hite?', time: '10 Jan', unreadCount: 0 },
];

export const ChatList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#150a25] to-black text-white p-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full md:hidden">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold md:text-2xl">Messages</h1>
          <button className="p-2 hover:bg-white/10 rounded-full">
            <Edit size={24} />
          </button>
        </div>

        {/* Chat List */}
        <div className="flex flex-col gap-2">
          {MOCK_CHATS.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer group border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={chat.user.avatar} alt={chat.user.name} className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-pink-500 transition-colors" />
                  {chat.unreadCount > 0 && (
                     <div className="absolute top-0 right-0 w-4 h-4 bg-pink-500 rounded-full border-2 border-[#150a25]"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white group-hover:text-pink-400 transition-colors">{chat.user.name}</h3>
                  <p className={`text-sm ${chat.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                 <span className="text-xs text-gray-500">{chat.time}</span>
                 {chat.id === 'c1' || chat.id === 'c4' ? (
                   <span className="text-yellow-400 text-lg">☀</span>
                 ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};