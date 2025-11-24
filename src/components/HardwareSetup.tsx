
import React from 'react';
import { RECOMMENDED_HARDWARE } from '../constants';
import { Tablet, Scan, Cable } from 'lucide-react';

const HardwareSetup: React.FC<{ onImportStudents?: any }> = () => {
  return (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Hardware Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RECOMMENDED_HARDWARE.map(dev => (
                    <div key={dev.id} className="p-4 border rounded-xl">
                        <h3 className="font-bold">{dev.name}</h3>
                        <p className="text-sm text-slate-500">{dev.description}</p>
                        <span className="block mt-2 font-mono text-xs bg-slate-100 p-1 rounded text-center">{dev.priceRange}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default HardwareSetup;
