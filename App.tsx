
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  PlusSquare, 
  Calendar as CalendarIcon, 
  Settings, 
  LayoutGrid,
  TrendingUp,
  CloudSun,
  Camera,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { Category, ClothingItem, WeatherInfo, CalendarEvent } from './types';
import Navigation from './components/Navigation';
import WardrobeGrid from './components/WardrobeGrid';
import CameraUpload from './components/CameraUpload';
import DailyOutfit from './components/DailyOutfit';
import CalendarView from './components/CalendarView';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'wardrobe' | 'add' | 'calendar' | 'stats'>('home');
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [weather, setWeather] = useState<WeatherInfo>({ temp: 22, condition: 'Sunny', icon: '☀️' });
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Coffee with Sarah', type: 'Casual', date: new Date().toISOString() }
  ]);

  // Load wardrobe from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aura_wardrobe');
    if (saved) setWardrobe(JSON.parse(saved));
  }, []);

  // Save wardrobe to localStorage
  useEffect(() => {
    localStorage.setItem('aura_wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  const handleAddItem = (item: ClothingItem) => {
    setWardrobe(prev => [item, ...prev]);
    setActiveTab('wardrobe');
  };

  const handleDeleteItem = (id: string) => {
    setWardrobe(prev => prev.filter(i => i.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard 
          wardrobe={wardrobe} 
          weather={weather} 
          events={events} 
          onNavigate={(tab) => setActiveTab(tab)}
        />;
      case 'wardrobe':
        return <WardrobeGrid wardrobe={wardrobe} onDelete={handleDeleteItem} />;
      case 'add':
        return <CameraUpload onAdd={handleAddItem} onCancel={() => setActiveTab('home')} />;
      case 'calendar':
        return <CalendarView events={events} onAddEvent={(e) => setEvents([...events, e])} />;
      case 'stats':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Wardrobe Insights</h1>
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-slate-100">
              <p className="text-slate-500 mb-2">Total Items</p>
              <p className="text-4xl font-bold">{wardrobe.length}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {Object.values(Category).map(cat => (
                 <div key={cat} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <p className="text-sm text-slate-500">{cat}</p>
                   <p className="text-xl font-bold">{wardrobe.filter(i => i.category === cat).length}</p>
                 </div>
               ))}
            </div>
          </div>
        );
      default:
        return <Dashboard wardrobe={wardrobe} weather={weather} events={events} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative pb-24 flex flex-col">
      <header className="px-6 pt-8 pb-4 bg-slate-50 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AuraStyle</p>
            <h1 className="text-xl font-bold text-slate-900">Digital Wardrobe</h1>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
             <Settings className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4">
        {renderContent()}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
