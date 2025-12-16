
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export const Signup: React.FC = () => {
  const { signup } = useGlobal();
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !handle || !email || !password) return;

    setLoading(true);
    try {
      // Simulate network delay for effect
      await delay(1000);
      await signup(name, handle, email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
       {/* Background Ambience */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join Orion</h1>
          <p className="text-gray-400">Begin your journey across the stars.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="text-gray-500 group-focus-within:text-pink-500 transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <AtSign className="text-gray-500 group-focus-within:text-pink-500 transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Handle (e.g. @astro)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-gray-500 group-focus-within:text-pink-500 transition-colors" size={20} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-gray-500 group-focus-within:text-pink-500 transition-colors" size={20} />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-lg hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {loading ? 'Preparing Launch...' : 'Launch Account'} <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Already have a signal?{' '}
            <Link to="/login" className="text-pink-500 hover:text-pink-400 font-medium transition-colors">
              Reconnect
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
