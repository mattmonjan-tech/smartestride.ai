
import React, { useState } from 'react';
import SimulatedMap, { RoadDefinition } from './SimulatedMap';
import { BusRoute, OptimizationInsight } from '../types';
import { Layers, Map as MapIcon, Satellite, Activity } from 'lucide-react';

interface LiveMapProps {
  routes: BusRoute[];
  onDismissAlert?: (busId: string) => void;
  onReportIssue?: (busId: string, busNumber: string) => void;
  roadOverrides?: RoadDefinition[];
  routeOverrides?: Record<string, string>;
  optimizationInsights?: OptimizationInsight[];
}

const LiveMap: React.FC<LiveMapProps> = (props) => {
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'traffic'>('standard');

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm group/livemap">
      {/* Map Controls Overlay */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-md p-1 rounded-lg shadow-md border border-slate-200 flex flex-col gap-1">
            <button 
                onClick={() => setMapStyle('standard')}
                title="Standard View"
                className={`p-2 rounded transition-all ${mapStyle === 'standard' ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
            >
                <MapIcon size={18} />
            </button>
            <button 
                onClick={() => setMapStyle('satellite')}
                title="Satellite View"
                className={`p-2 rounded transition-all ${mapStyle === 'satellite' ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100 text-slate-600'}`}
            >
                <Satellite size={18} />
            </button>
            <button 
                onClick={() => setMapStyle('traffic')}
                title="Traffic Density"
                className={`p-2 rounded transition-all ${mapStyle === 'traffic' ? 'bg-orange-100 text-orange-600' : 'hover:bg-slate-100 text-slate-600'}`}
            >
                <Activity size={18} />
            </button>
        </div>
      </div>

      {/* Map Status Badge */}
      <div className="absolute top-3 left-3 z-20">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md shadow-sm border border-slate-200 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {mapStyle === 'traffic' ? 'Live Traffic' : 'Live GPS'}
              </span>
          </div>
      </div>

      {/* Layer Effects */}
      {mapStyle === 'satellite' && (
          <div className="absolute inset-0 bg-slate-900/50 z-0 pointer-events-none mix-blend-multiply" />
      )}
      
      {/* Actual Map Component */}
      <SimulatedMap {...props} />
      
      {/* Traffic Layer Simulation */}
      {mapStyle === 'traffic' && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-30" 
               style={{backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)'}} 
          />
      )}
    </div>
  );
};

export default LiveMap;
