import React, { useState } from 'react';
import { BusRoute, BusStatus } from '../types';
import { Bus, MapPin, AlertTriangle, CheckCircle, Navigation, Clock, Shield } from 'lucide-react';

interface DriverAppProps {
  routes: BusRoute[];
  onUpdateStatus: (busId: string, status: BusStatus, alertMsg?: string) => void;
}

const DriverApp: React.FC<DriverAppProps> = ({ routes, onUpdateStatus }) => {
  // Simulator: Pick a random bus to be "my" bus for this session
  const [myBusId] = useState<string>(() => {
    if (routes.length > 0) return routes[0].id;
    return '';
  });

  const myBus = routes.find(r => r.id === myBusId);

  if (!myBus) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-slate-800">No Bus Assigned</h2>
          <p className="text-slate-500">Please contact dispatch.</p>
        </div>
      </div>
    );
  }

  const handleStatusChange = (status: BusStatus) => {
    onUpdateStatus(myBusId, status);
  };

  const handleEmergency = () => {
    onUpdateStatus(myBusId, BusStatus.DELAYED, "EMERGENCY: Driver needs assistance!");
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md shrink-0">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-1.5 rounded text-slate-900">
              <Bus size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">Driver<span className="text-yellow-500">Connect</span></h1>
              <p className="text-[10px] text-slate-400">v71.0.0 • {myBus.busNumber}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${myBus.status === BusStatus.ON_ROUTE ? 'bg-green-500 text-white' :
              myBus.status === BusStatus.DELAYED ? 'bg-red-500 text-white' :
                'bg-slate-700 text-slate-300'
            }`}>
            <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
            {myBus.status}
          </div>
        </div>
      </header>

      {/* Main Controls */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4">

        {/* Current Stop Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
            <Navigation size={12} /> Next Stop
          </h3>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Maple Ave & 5th St</h2>
              <p className="text-slate-500 text-sm">Scheduled: 7:42 AM <span className="text-green-600 font-bold ml-1">(On Time)</span></p>
            </div>
            <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-bold text-sm transition-colors">
              Skip Stop
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm shadow-md transition-colors">
              Arrived
            </button>
          </div>
        </div>

        {/* Status Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleStatusChange(BusStatus.ON_ROUTE)}
            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${myBus.status === BusStatus.ON_ROUTE
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-green-200'
              }`}
          >
            <CheckCircle size={24} />
            <span className="font-bold">On Route</span>
          </button>

          <button
            onClick={() => handleStatusChange(BusStatus.IDLE)}
            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${myBus.status === BusStatus.IDLE
                ? 'border-slate-500 bg-slate-100 text-slate-800'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
          >
            <Clock size={24} />
            <span className="font-bold">On Break</span>
          </button>
        </div>

        {/* Traffic / Delay Report */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Report Issues</h3>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => onUpdateStatus(myBusId, BusStatus.DELAYED, "Heavy Traffic")} className="p-2 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-lg text-xs font-medium text-slate-700 flex flex-col items-center gap-1 transition-colors">
              <Navigation size={16} className="text-orange-500" />
              Traffic
            </button>
            <button onClick={() => onUpdateStatus(myBusId, BusStatus.MAINTENANCE, "Mechanical Issue")} className="p-2 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-xs font-medium text-slate-700 flex flex-col items-center gap-1 transition-colors">
              <Shield size={16} className="text-red-500" />
              Mechanical
            </button>
            <button onClick={() => onUpdateStatus(myBusId, BusStatus.DELAYED, "Student Incident")} className="p-2 bg-slate-50 hover:bg-yellow-50 border border-slate-200 hover:border-yellow-200 rounded-lg text-xs font-medium text-slate-700 flex flex-col items-center gap-1 transition-colors">
              <AlertTriangle size={16} className="text-yellow-500" />
              Incident
            </button>
          </div>
        </div>

        <button
          onClick={handleEmergency}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 animate-pulse mt-auto"
        >
          <AlertTriangle size={24} />
          SOS - EMERGENCY
        </button>

      </main>
    </div>
  );
};

export default DriverApp;
