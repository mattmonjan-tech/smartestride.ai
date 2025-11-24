
import React from 'react';
import { BusRoute } from '../types';
import { Calendar, Plus } from 'lucide-react';

const SpecialEvents: React.FC<{ routes: BusRoute[], onAddEvent: any }> = ({ routes }) => {
  return (
    <div className="h-full p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Calendar className="text-indigo-600"/> Special Events</h2>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2"><Plus size={18}/> Schedule Event</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.filter(r => r.type === 'FIELD_TRIP').map(r => (
                <div key={r.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold">{r.name}</h3>
                    <p className="text-sm text-slate-500">{r.destination}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default SpecialEvents;
