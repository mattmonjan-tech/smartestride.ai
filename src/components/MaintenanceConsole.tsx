
import React from 'react';
import { Wrench } from 'lucide-react';

const MaintenanceConsole: React.FC<any> = ({ tickets }) => {
  return (
    <div className="p-6 h-full bg-white rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Wrench className="text-orange-600"/> Maintenance Console</h2>
        <div className="space-y-2">
            {tickets.map((t: any) => (
                <div key={t.id} className="p-4 border rounded-lg flex justify-between">
                    <span className="font-bold">{t.issue}</span>
                    <span className="text-sm bg-slate-100 px-2 py-1 rounded">{t.status}</span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default MaintenanceConsole;
