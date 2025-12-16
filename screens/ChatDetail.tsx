import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Send, Smile, Phone, Video } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Message } from '../types';
import { generateChatResponse } from '../services/geminiService';

const REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍'];

export const ChatDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'u2', text: 'Nebula Photography saeet or tioas emloie vahy. 😚', timestamp: '2:00 PM', isMe: false, reactions: ['❤️'] },
    { id: '2', senderId: 'me', text: 'Then sse meehoo replny?', timestamp: '2:01 PM', isMe: true },
    { id: '3', senderId: 'u2', text: 'Messages in conuimdk? ✨', timestamp: '1:30 PM', isMe: false },
  ]);

  // Reaction State
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout for browser compatibility
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.isMe ? 'user' : 'model',
      content: m.text
    }));

    // Call Gemini
    const replyText = await generateChatResponse(history, currentInput);

    const replyMessage: Message = {
      id: (Date.now() + 1).toString(),
      senderId: 'u2',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: false
    };

    setIsTyping(false);
    setMessages(prev => [...prev, replyMessage]);
  };

  const handleVideoCall = () => {
    navigate('/call');
  };

  // --- Long Press Logic ---
  const startPress = (msgId: string, e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    longPressTimer.current = setTimeout(() => {
      setActiveMessageId(msgId);
      // Position menu slightly above the press
      setMenuPosition({ x: clientX, y: clientY - 50 });
    }, 500);
  };

  const cancelPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleReactionSelect = (emoji: string) => {
    if (!activeMessageId) return;

    setMessages(prev => prev.map(msg => {
      if (msg.id === activeMessageId) {
        const currentReactions = msg.reactions || [];
        const exists = currentReactions.includes(emoji);
        // Toggle reaction
        const newReactions = exists 
          ? currentReactions.filter(r => r !== emoji) 
          : [...currentReactions, emoji];
        return { ...msg, reactions: newReactions };
      }
      return msg;
    }));
    setActiveMessageId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-black relative">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://picsum.photos/600/1000?grayscale&blur=2")' }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#150a25]/90 to-black/90"></div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col h-full w-full max-w-4xl mx-auto md:border-x md:border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full">
              <ArrowLeft />
            </button>
            <div className="relative cursor-pointer">
              <img src="https://picsum.photos/100/100?random=3" alt="User" className="w-10 h-10 rounded-full border border-purple-400" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight cursor-pointer hover:underline">starlight</h3>
              <span className="text-xs text-purple-300">Andromeda Galaxy</span>
            </div>
          </div>
          <div className="flex gap-4 text-white">
            <Phone className="cursor-pointer hover:text-pink-400 transition-colors" size={22} />
            <Video className="cursor-pointer hover:text-pink-400 transition-colors" size={22} onClick={handleVideoCall} />
            <MoreVertical className="cursor-pointer hover:text-pink-400 transition-colors" size={22} />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar relative" onScroll={() => setActiveMessageId(null)}>
          <div className="text-center text-xs text-gray-500 my-4">Today 7:20 PM</div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              {!msg.isMe && (
                 <img src="https://picsum.photos/100/100?random=3" className="w-8 h-8 rounded-full mr-2 self-end mb-1" />
              )}
              <div 
                className={`relative max-w-[75%] md:max-w-[60%] p-3 rounded-2xl select-none transition-transform active:scale-95 duration-200 ${
                  msg.isMe 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 rounded-br-none text-white' 
                    : 'bg-white/10 backdrop-blur-md border border-white/5 rounded-bl-none text-gray-200'
                }`}
                onMouseDown={(e) => startPress(msg.id, e)}
                onMouseUp={cancelPress}
                onMouseLeave={cancelPress}
                onTouchStart={(e) => startPress(msg.id, e)}
                onTouchEnd={cancelPress}
                onContextMenu={(e) => e.preventDefault()} // Prevent default context menu
              >
                <p className="text-sm">{msg.text}</p>

                {/* Reactions Display */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`absolute -bottom-3 ${msg.isMe ? 'right-0' : 'left-0'} flex gap-0.5 bg-[#150a25] border border-white/10 rounded-full px-1.5 py-0.5 shadow-lg`}>
                    {msg.reactions.map((emoji, idx) => (
                      <span key={idx} className="text-[10px] leading-none">{emoji}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <img src="https://picsum.photos/100/100?random=3" className="w-8 h-8 rounded-full mr-2 self-end mb-1" />
               <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none">
                 <div className="flex gap-1">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reaction Menu Overlay */}
        {activeMessageId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setActiveMessageId(null)}>
             <div 
               className="absolute bg-black/80 backdrop-blur-md border border-white/20 rounded-full p-2 flex gap-3 shadow-2xl animate-in fade-in zoom-in duration-200"
               style={{ 
                 left: Math.min(Math.max(menuPosition.x - 100, 10), window.innerWidth - 220), // Clamp to screen width
                 top: menuPosition.y - 60 
               }}
               onClick={(e) => e.stopPropagation()}
             >
                {REACTIONS.map(emoji => (
                  <button 
                    key={emoji}
                    className="text-2xl hover:scale-125 transition-transform p-1"
                    onClick={() => handleReactionSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-black/40 backdrop-blur-lg border-t border-white/5">
          <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 border border-white/10 focus-within:border-pink-500/50 transition-colors">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
               <span className="text-sm">+</span>
            </div>
            <input 
              type="text" 
              placeholder="Write a message..." 
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Smile className="text-gray-400 cursor-pointer hover:text-white" size={20} />
            <Send 
              className={`${input ? 'text-pink-500' : 'text-gray-500'} cursor-pointer transform hover:scale-110 transition-transform`} 
              size={20}
              onClick={handleSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
};