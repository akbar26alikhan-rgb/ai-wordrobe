
import React from 'react';
import { Home, LayoutGrid, PlusSquare, Calendar, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'wardrobe', icon: LayoutGrid, label: 'Wardrobe' },
    { id: 'add', icon: PlusSquare, label: 'Add', primary: true },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'stats', icon: TrendingUp, label: 'Stats' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-between items-center safe-area-bottom z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center transition-all ${
            tab.primary 
            ? 'bg-black p-3 -mt-10 rounded-2xl shadow-xl shadow-black/20 text-white transform hover:scale-105 active:scale-95' 
            : activeTab === tab.id ? 'text-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <tab.icon className={`${tab.primary ? 'w-6 h-6' : 'w-5 h-5'}`} />
          {!tab.primary && <span className="text-[10px] font-medium mt-1">{tab.label}</span>}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
