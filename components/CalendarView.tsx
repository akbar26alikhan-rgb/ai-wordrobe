
import React, { useState } from 'react';
import { Plus, X, Calendar as CalendarIcon, Briefcase, Heart, Coffee, Trophy } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['type']>('Casual');

  const types: CalendarEvent['type'][] = ['Work', 'Casual', 'Formal', 'Date', 'Sports'];

  const getTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'Work': return Briefcase;
      case 'Formal': return Trophy;
      case 'Date': return Heart;
      case 'Sports': return Trophy;
      default: return Coffee;
    }
  };

  const handleAdd = () => {
    if (newTitle) {
      onAddEvent({
        id: Math.random().toString(),
        title: newTitle,
        type: newType,
        date: new Date().toISOString()
      });
      setNewTitle('');
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Your Schedule</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className="p-2 bg-black text-white rounded-xl shadow-lg shadow-black/10"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">New Event</h3>
            <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <input 
            type="text" 
            placeholder="Event name (e.g., Gala Dinner)"
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setNewType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  newType === type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button 
            onClick={handleAdd}
            className="w-full py-3 bg-black text-white rounded-xl font-bold"
          >
            Add to Calendar
          </button>
        </div>
      )}

      <div className="space-y-4">
        {events.length > 0 ? (
          events.map(event => {
            const Icon = getTypeIcon(event.type);
            return (
              <div key={event.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                   <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500">{event.type} • Today</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-slate-400">
             No upcoming events
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
