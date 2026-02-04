
import React, { useState, useEffect } from 'react';
import { CloudSun, Calendar as CalendarIcon, Sparkles, RefreshCcw } from 'lucide-react';
import { ClothingItem, WeatherInfo, CalendarEvent } from '../types';
import { suggestOutfit } from '../services/geminiService';

interface DashboardProps {
  wardrobe: ClothingItem[];
  weather: WeatherInfo;
  events: CalendarEvent[];
  onNavigate: (tab: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ wardrobe, weather, events, onNavigate }) => {
  const [suggestion, setSuggestion] = useState<{ items: ClothingItem[], reasoning: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSuggestion = async () => {
    if (wardrobe.length < 3) return;
    setLoading(true);
    try {
      const result = await suggestOutfit(wardrobe, weather, events);
      const suggestedItems = result.items
        .map(id => wardrobe.find(item => item.id === id))
        .filter(Boolean) as ClothingItem[];
      
      setSuggestion({ items: suggestedItems, reasoning: result.reasoning });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wardrobe.length >= 3 && !suggestion) {
      generateSuggestion();
    }
  }, [wardrobe]);

  return (
    <div className="space-y-6 pb-4">
      {/* Weather Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm font-medium">Today in London</p>
            <h2 className="text-3xl font-bold mt-1">{weather.temp}°C</h2>
            <p className="text-blue-100 mt-1">{weather.condition}</p>
          </div>
          <span className="text-5xl">{weather.icon}</span>
        </div>
      </div>

      {/* Social Calendar Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            Social Calendar
          </h3>
          <button onClick={() => onNavigate('calendar')} className="text-xs font-semibold text-blue-600">View All</button>
        </div>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-blue-600">
                  {new Date(event.date).getDate()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500">{event.type}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-4 italic">No events scheduled for today</p>
        )}
      </div>

      {/* AI Stylist Suggestion */}
      <div className="relative">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Stylist Pick
          </h3>
          <button 
            onClick={generateSuggestion} 
            disabled={loading || wardrobe.length < 3}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-slate-100 animate-pulse">
            <Sparkles className="w-8 h-8 text-amber-200 mb-2" />
            <p className="text-slate-400 text-sm font-medium">Curating your look...</p>
          </div>
        ) : suggestion && suggestion.items.length > 0 ? (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <div className="flex -space-x-4 mb-4 overflow-hidden">
              {suggestion.items.map((item, idx) => (
                <div key={item.id} className="w-24 h-24 rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-slate-100 flex-shrink-0" style={{zIndex: 5-idx}}>
                   <img src={item.image} alt={item.subCategory} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-amber-200 pl-4">
              "{suggestion.reasoning}"
            </p>
            <button className="w-full mt-6 py-4 bg-black text-white rounded-2xl font-bold shadow-lg shadow-black/10 active:scale-[0.98] transition-transform">
              Wear This Outfit
            </button>
          </div>
        ) : (
          <div className="bg-slate-100 rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-sm font-medium mb-3">Add at least 3 items to your wardrobe for AI suggestions</p>
            <button 
              onClick={() => onNavigate('add')}
              className="px-6 py-2 bg-white text-slate-900 rounded-xl font-bold border border-slate-200 shadow-sm"
            >
              Add Clothes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
