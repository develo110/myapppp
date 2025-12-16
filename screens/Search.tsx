import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

const CATEGORIES = ['All', 'Nebula', 'Planets', 'Stars', 'Black Holes', 'Galaxies'];

const GRID_ITEMS = [
  { id: 1, category: 'Nebula', title: 'Cosmic Cloud', img: 'https://picsum.photos/300/300?random=100', span: 'col-span-1 row-span-1' },
  { id: 2, category: 'Planets', title: 'Red Giant', img: 'https://picsum.photos/300/400?random=101', span: 'col-span-1 row-span-2' },
  { id: 3, category: 'Stars', title: 'Bright Star', img: 'https://picsum.photos/300/300?random=102', span: 'col-span-1 row-span-1' },
  { id: 4, category: 'Nebula', title: 'Purple Haze', img: 'https://picsum.photos/300/300?random=103', span: 'col-span-1 row-span-1' },
  { id: 5, category: 'Black Holes', title: 'Event Horizon', img: 'https://picsum.photos/300/500?random=104', span: 'col-span-1 row-span-2' },
  { id: 6, category: 'Galaxies', title: 'Spiral', img: 'https://picsum.photos/300/300?random=105', span: 'col-span-1 row-span-1' },
  { id: 7, category: 'Planets', title: 'Blue Marble', img: 'https://picsum.photos/300/300?random=106', span: 'col-span-1 row-span-1' },
  { id: 8, category: 'Stars', title: 'Supernova', img: 'https://picsum.photos/300/400?random=107', span: 'col-span-1 row-span-2' },
  { id: 9, category: 'Nebula', title: 'Orion', img: 'https://picsum.photos/300/300?random=108', span: 'col-span-1 row-span-1' },
  { id: 10, category: 'Galaxies', title: 'Andromeda', img: 'https://picsum.photos/300/300?random=109', span: 'col-span-1 row-span-1' },
  { id: 11, category: 'Black Holes', title: 'Void', img: 'https://picsum.photos/300/300?random=110', span: 'col-span-1 row-span-1' },
  { id: 12, category: 'Stars', title: 'Dwarf', img: 'https://picsum.photos/300/300?random=111', span: 'col-span-1 row-span-1' },
];

export const Search: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = GRID_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = 
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f0c29] pb-24 text-white">
      <div className="p-4 pt-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-pink-500 mb-4 tracking-widest md:hidden">ORION</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search universe (e.g. Nebula)..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors focus:bg-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Categories / Tags */}
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-3">Explore Topics</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm border transition-all cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/25' 
                    : 'bg-white/5 border-white/5 text-gray-300 hover:border-pink-500/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Content */}
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-white font-semibold">
             {activeCategory === 'All' ? 'Discover' : `${activeCategory} Results`}
             <span className="text-gray-500 text-sm font-normal ml-2">({filteredItems.length})</span>
           </h2>
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[150px] grid-flow-dense">
            {filteredItems.map((item) => (
               <div key={item.id} className={`${item.span} rounded-2xl overflow-hidden relative group cursor-pointer`}>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <span className="text-white font-semibold text-sm">{item.title}</span>
                    <span className="text-pink-400 text-xs">{item.category}</span>
                  </div>
               </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
             <SearchIcon size={48} className="mb-4 opacity-20" />
             <p>No results found for "{searchQuery}" in {activeCategory}.</p>
             <button 
               onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
               className="mt-4 text-pink-500 hover:underline"
             >
               Clear filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
};