
import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Send, Film, Music, Sparkles, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';
import { editImageWithAi, generateVideoFromImage } from '../services/geminiService';

type CreateMode = 'POST' | 'REEL';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { addPost, addReel } = useGlobal();
  
  const [mode, setMode] = useState<CreateMode>('POST');
  const [caption, setCaption] = useState('');
  const [song, setSong] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [uploading, setUploading] = useState(false);

  // AI State
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsVideo(selectedFile.type.startsWith('video/'));
      setShowAiPrompt(false); // Reset AI panel
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setUploading(true);
    try {
        if (mode === 'POST') {
          await addPost(caption, file, song);
        } else {
          await addReel(caption, file, song);
        }
        navigate(mode === 'POST' ? '/' : '/reels');
    } catch (e) {
        alert("Failed to upload content.");
    } finally {
        setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setIsVideo(false);
    setShowAiPrompt(false);
  };

  const handleAiMagic = async () => {
    if (!file || !aiPrompt.trim()) return;
    
    setIsProcessingAi(true);
    try {
      let resultBlob: Blob | null = null;
      
      if (mode === 'POST') {
        // Image Editing
        resultBlob = await editImageWithAi(file, aiPrompt);
      } else {
        // Reel Mode - Video Generation from Image
        if (isVideo) {
            alert("AI effects are currently only supported for images in Reels (Image-to-Video).");
            setIsProcessingAi(false);
            return;
        }
        resultBlob = await generateVideoFromImage(file, aiPrompt);
      }

      if (resultBlob) {
        const newFile = new File([resultBlob], mode === 'POST' ? 'edited_image.png' : 'generated_video.mp4', {
          type: resultBlob.type
        });
        
        setFile(newFile);
        setPreview(URL.createObjectURL(newFile));
        
        if (mode === 'REEL') {
            setIsVideo(true); // Since we generated a video
        }
        setShowAiPrompt(false);
        setAiPrompt('');
      } else {
        alert("Failed to generate AI effect. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing AI effect.");
    } finally {
      setIsProcessingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-14 md:pt-6">
       <div className="max-w-2xl mx-auto w-full">
         
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full">
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Create</h1>
            <button 
              onClick={handleSubmit} 
              disabled={!file || isProcessingAi || uploading}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                 file && !isProcessingAi && !uploading ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30' : 'bg-white/10 text-gray-500'
              }`}
            >
               {uploading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
               <span>{mode === 'POST' ? 'Post' : 'Share'}</span>
            </button>
         </div>

         {/* Mode Switcher */}
         <div className="flex bg-white/10 p-1 rounded-xl mb-6">
           <button 
             onClick={() => { setMode('POST'); clearFile(); }}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
               mode === 'POST' ? 'bg-white/20 text-white font-semibold' : 'text-gray-400 hover:text-white'
             }`}
           >
             <ImageIcon size={20} />
             Post
           </button>
           <button 
             onClick={() => { setMode('REEL'); clearFile(); }}
             className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
               mode === 'REEL' ? 'bg-white/20 text-white font-semibold' : 'text-gray-400 hover:text-white'
             }`}
           >
             <Film size={20} />
             Reel
           </button>
         </div>

         <div className="space-y-6">
            <textarea
               placeholder={mode === 'POST' ? "What's happening in your universe?" : "Describe your reel..."}
               className="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none resize-none min-h-[100px]"
               value={caption}
               onChange={(e) => setCaption(e.target.value)}
            />

            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 focus-within:border-pink-500/50 transition-colors">
              <Music className="text-pink-500" size={20} />
              <input 
                type="text"
                placeholder={mode === 'POST' ? "Tag a song (optional)..." : "Tag a song or audio..."}
                className="bg-transparent w-full focus:outline-none text-sm"
                value={song}
                onChange={(e) => setSong(e.target.value)}
              />
            </div>

            {preview ? (
               <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900 group">
                  {isVideo ? (
                    <video 
                      src={preview} 
                      className="w-full h-auto max-h-[600px] object-cover" 
                      controls 
                      autoPlay 
                      muted 
                      loop 
                    />
                  ) : (
                    <img src={preview} alt="Preview" className="w-full h-auto max-h-[600px] object-cover" />
                  )}
                  
                  {/* Delete Button */}
                  <button 
                     onClick={clearFile}
                     className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-red-500/80 transition-colors z-10"
                  >
                     <X size={20} />
                  </button>

                  {/* AI Magic Button (Only show if not already processing) */}
                  {!isProcessingAi && !showAiPrompt && (
                      <button 
                        onClick={() => setShowAiPrompt(true)}
                        className="absolute bottom-4 right-4 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform z-10"
                      >
                         <Sparkles size={18} />
                         <span className="text-sm font-semibold">AI Effects</span>
                      </button>
                  )}

                  {/* AI Loading Overlay */}
                  {isProcessingAi && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
                        <p className="text-white font-medium animate-pulse">
                            {mode === 'POST' ? 'Applying cosmic filters...' : 'Generating video (this may take a minute)...'}
                        </p>
                    </div>
                  )}

                  {/* AI Prompt Input Overlay */}
                  {showAiPrompt && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/90 p-4 border-t border-white/10 z-20 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                                <Sparkles size={14} />
                                {mode === 'POST' ? 'AI Image Filter' : 'AI Image to Video'}
                            </h3>
                            <button onClick={() => setShowAiPrompt(false)} className="text-gray-400 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                placeholder={mode === 'POST' ? "e.g., Cyberpunk, Oil Painting, Neon..." : "e.g., Camera pan, Slow zoom, Cinematic..."}
                                className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAiMagic()}
                            />
                            <button 
                                onClick={handleAiMagic}
                                disabled={!aiPrompt.trim()}
                                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                  )}
               </div>
            ) : (
               <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-pink-500/50 hover:bg-white/5 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                     <div className="p-4 bg-white/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        {mode === 'POST' ? (
                          <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-pink-500" />
                        ) : (
                          <Film className="w-8 h-8 text-gray-400 group-hover:text-pink-500" />
                        )}
                     </div>
                     <p className="mb-2 text-sm text-gray-400">
                       <span className="font-semibold">Click to upload</span> {mode === 'POST' ? 'image' : 'video or image'}
                     </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept={mode === 'POST' ? "image/*" : "video/*,image/*"} 
                    onChange={handleFileChange} 
                  />
               </label>
            )}
         </div>
       </div>
    </div>
  );
};
