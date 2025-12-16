import React, { useState } from 'react';
import { ArrowLeft, Bell, Lock, MessageSquare, Moon, Sun, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3 mt-6 px-2">{children}</h3>
);

interface SettingItemProps {
  icon: any;
  title: string;
  onClick?: () => void;
  toggle?: () => void;
  toggleValue?: boolean;
}

const SettingItem = ({ icon: Icon, title, onClick, toggle, toggleValue }: SettingItemProps) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl mb-2 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-tr from-purple-900 to-slate-900 rounded-lg text-purple-300">
         <Icon size={20} />
      </div>
      <span className="text-white font-medium">{title}</span>
    </div>
    
    {toggle ? (
      <div 
        className={`w-12 h-6 rounded-full p-1 transition-colors ${toggleValue ? 'bg-pink-600' : 'bg-gray-600'}`}
        onClick={(e) => { e.stopPropagation(); toggle(); }}
      >
         <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggleValue ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </div>
    ) : (
      <span className="text-gray-500">›</span>
    )}
  </div>
);

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useGlobal();
  const [notifEnabled, setNotifEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white p-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full md:hidden">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Settings</h1>
          <div className="w-8 md:hidden"></div>
        </div>

        <div className="px-2">
          <h1 className="text-2xl font-bold mb-1 text-pink-500">Privacy & Security</h1>
          <p className="text-gray-500 text-sm mb-6">Manage your account security and preferences</p>

          <SectionTitle>Privacy & Security</SectionTitle>
          <SettingItem icon={Lock} title="Privacy Security" />
          <SettingItem icon={MessageSquare} title="Notifications" />

          <SectionTitle>Notifications</SectionTitle>
          <SettingItem 
            icon={Bell} 
            title="Notifications" 
            toggle={() => setNotifEnabled(!notifEnabled)}
            toggleValue={notifEnabled}
          />

          <SectionTitle>Theme (Dark Space)</SectionTitle>
          <div className="grid grid-cols-3 gap-3 mt-2 mb-8">
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 opacity-50 cursor-pointer hover:opacity-80 transition-opacity">
              <Shield size={24} className="mb-2 text-purple-400" />
              <span className="text-xs text-gray-400">Security</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-pink-500/50 cursor-pointer">
              <Sun size={24} className="mb-2 text-pink-400" />
              <span className="text-xs text-white">Light</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 opacity-50 cursor-pointer hover:opacity-80 transition-opacity">
              <Moon size={24} className="mb-2 text-purple-400" />
              <span className="text-xs text-gray-400">Theme</span>
            </div>
          </div>
          
          <button 
             onClick={logout}
             className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium"
          >
             <LogOut size={20} />
             Log Out
          </button>
        </div>
      </div>
    </div>
  );
};