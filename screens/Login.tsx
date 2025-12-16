
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

export const Login: React.FC = () => {
  const { login } = useGlobal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      // Simulate network delay for effect
      await delay(800);
      await login(email, password);
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
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[20%] w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-[30%] left-[10%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 mb-6 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
            <Star className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-wider text-white mb-2">ORION</h1>
          <p className="text-gray-400">Reconnect with the galaxy.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-pulse">Initializing...</span>
            ) : (
              <>
                Enter Orbit <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            New explorer?{' '}
            <Link to="/signup" className="text-pink-500 hover:text-pink-400 font-medium transition-colors">
              Join the Mission
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
