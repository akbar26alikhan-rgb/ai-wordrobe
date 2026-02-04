
import React, { useState } from 'react';
// Added missing LayoutGrid to the imports from lucide-react
import { Search, Filter, Trash2, X, LayoutGrid } from 'lucide-react';
import { ClothingItem, Category } from '../types';

interface WardrobeGridProps {
  wardrobe: ClothingItem[];
  onDelete: (id: string) => void;
}

const WardrobeGrid: React.FC<WardrobeGridProps> = ({ wardrobe, onDelete }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = wardrobe.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.color.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search your wardrobe..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All' ? 'bg-black text-white' : 'bg-white text-slate-500 border border-slate-100 shadow-sm'
            }`}
          >
            All Items
          </button>
          {Object.values(Category).map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'bg-black text-white' : 'bg-white text-slate-500 border border-slate-100 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <div key={item.id} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
              <div className="aspect-square bg-slate-100">
                <img src={item.image} alt={item.subCategory} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-slate-900">{item.subCategory}</p>
                <p className="text-[10px] text-slate-500">{item.color} • {item.style}</p>
                <div className="mt-2 flex justify-between items-center">
                   <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">Worn {item.wearCount}x</span>
                   <button 
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 text-sm font-medium">No items found</p>
        </div>
      )}
    </div>
  );
};

export default WardrobeGrid;
