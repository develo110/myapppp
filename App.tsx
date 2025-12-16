
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home } from './screens/Home';
import { ChatList } from './screens/ChatList';
import { ChatDetail } from './screens/ChatDetail';
import { Reels } from './screens/Reels';
import { Search } from './screens/Search';
import { Profile } from './screens/Profile';
import { Settings } from './screens/Settings';
import { Call } from './screens/Call';
import { CreatePost } from './screens/CreatePost';
import { Login } from './screens/Login';
import { Signup } from './screens/Signup';
import { Notifications } from './screens/Notifications';
import { BottomNav } from './components/BottomNav';
import { GlobalProvider, useGlobal } from './context/GlobalContext';

// Protected Layout that includes BottomNav
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isCall = location.pathname === '/call';

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white overflow-x-hidden">
      <BottomNav />
      <div 
        className={`flex-1 min-h-screen transition-all duration-300 relative
          ${isCall ? '' : 'md:ml-20 lg:ml-64'} 
        `}
      >
        {children}
      </div>
    </div>
  );
};

// Component to handle Auth Routing logic
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useGlobal();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <ProtectedLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chat/:id" element={<ChatDetail />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/call" element={<Call />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ProtectedLayout>
  );
};

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <Router>
        <AppRoutes />
      </Router>
    </GlobalProvider>
  );
};

export default App;
