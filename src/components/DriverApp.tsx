
import React, { useState } from 'react';
import { BusRoute, BusStatus } from '../types';
import { Bus, Navigation, CheckCircle2, AlertTriangle, Gauge, Power, LogOut, MapPin } from 'lucide-react';

interface DriverAppProps {
    routes: BusRoute[];
    onUpdateStatus: (busId: string, status: BusStatus, alert?: string) => void;
}

const DriverApp: React.FC<DriverAppProps> = ({ routes, onUpdateStatus }) => {
    const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
    const [isOnRoute, setIsOnRoute] = useState(false);
    const [showPreTrip, setShowPreTrip] = useState(false);
    const [checklist, setChecklist] = useState({
        tires: false,
        lights: false,
        fluids: false,
        brakes: false
    });

    const activeRoute = routes.find(r => r.id === selectedRouteId);

    const toggleCheck = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const allChecked = Object.values(checklist).every(Boolean);

    const handleStartRoute = () => {
        if (allChecked) {
            setShowPreTrip(false);
            setIsOnRoute(true);
            if (activeRoute) {
                onUpdateStatus(activeRoute.id, BusStatus.ON_ROUTE);
            }
        }
    };

    const handleEndRoute = () => {
        setIsOnRoute(false);
        setChecklist({ tires: false, lights: false, fluids: false, brakes: false });
        if (activeRoute) {
            onUpdateStatus(activeRoute.id, BusStatus.COMPLETED);
        }
    };

    const reportEmergency = () => {
        if (activeRoute) {
            onUpdateStatus(activeRoute.id, BusStatus.DELAYED, "DRIVER EMERGENCY DECLARED");
            alert("Emergency Signal Sent to Dispatch");
        }
    };

    if (!activeRoute) return <div className="p-8 text-center">No Routes Assigned. Contact Dispatch.</div>;

    return (
        <div className="h-screen bg-slate-900 text-white flex flex-col font-poppins">
            {/* Header */}
            <header className="bg-slate-800 p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Bus size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">RideSmart Driver</h1>
                        <p className="text-xs text-slate-400">Vehicle: {activeRoute.busNumber}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-bold">{activeRoute.driver}</p>
                        <p className="text-xs text-green-400">Connected</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {!isOnRoute ? (
                    <div className="max-w-2xl mx-auto w-full">
                        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl mb-6 border border-slate-700">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Navigation size={24} className="text-blue-500" />
                                Select Route
                            </h2>
                            <select 
                                value={selectedRouteId}
                                onChange={(e) => setSelectedRouteId(e.target.value)}
                                className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl text-lg mb-6"
                            >
                                {routes.map(r => (
                                    <option key={r.id} value={r.id}>{r.name} ({r.busNumber})</option>
                                ))}
                            </select>

                            {!showPreTrip ? (
                                <button 
                                    onClick={() => setShowPreTrip(true)}
                                    className="w-full py-6 bg-blue-600 hover:bg-blue-700 rounded-xl text-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
                                >
                                    Begin Pre-Trip Inspection
                                </button>
                            ) : (
                                <div className="animate-in slide-in-from-bottom-4">
                                    <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider">Safety Checklist</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <button 
                                            onClick={() => toggleCheck('tires')}
                                            className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${checklist.tires ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-slate-600 bg-slate-800/50'}`}
                                        >
                                            <CheckCircle2 size={32} /> Tires & Wheels
                                        </button>
                                        <button 
                                            onClick={() => toggleCheck('lights')}
                                            className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${checklist.lights ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-slate-600 bg-slate-800/50'}`}
                                        >
                                            <CheckCircle2 size={32} /> Lights & Signals
                                        </button>
                                        <button 
                                            onClick={() => toggleCheck('fluids')}
                                            className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${checklist.fluids ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-slate-600 bg-slate-800/50'}`}
                                        >
                                            <CheckCircle2 size={32} /> Fluid Levels
                                        </button>
                                        <button 
                                            onClick={() => toggleCheck('brakes')}
                                            className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${checklist.brakes ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-slate-600 bg-slate-800/50'}`}
                                        >
                                            <CheckCircle2 size={32} /> Air Brakes
                                        </button>
                                    </div>
                                    <button 
                                        onClick={handleStartRoute}
                                        disabled={!allChecked}
                                        className={`w-full py-6 rounded-xl text-2xl font-bold transition-all ${allChecked ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                    >
                                        Confirm & Start Route
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        {/* Status Panel */}
                        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col">
                            <div className="mb-auto">
                                <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold mb-2">Active Route</span>
                                <h2 className="text-3xl font-bold mb-1">{activeRoute.name}</h2>
                                <p className="text-slate-400 flex items-center gap-2"><MapPin size={16} /> Next: {activeRoute.nextStop}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 my-8">
                                <div className="bg-black/30 p-4 rounded-xl text-center">
                                    <p className="text-slate-400 text-xs uppercase">Speed</p>
                                    <p className="text-4xl font-mono font-bold">35 <span className="text-lg">mph</span></p>
                                </div>
                                <div className="bg-black/30 p-4 rounded-xl text-center">
                                    <p className="text-slate-400 text-xs uppercase">Occupancy</p>
                                    <p className="text-4xl font-mono font-bold">{activeRoute.occupancy}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <AlertTriangle className="text-orange-500" /> Report Traffic Delay
                                </button>
                                <button className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Gauge className="text-blue-500" /> Log Odometer
                                </button>
                            </div>
                        </div>

                        {/* Actions Panel */}
                        <div className="flex flex-col gap-4">
                             <button 
                                onClick={reportEmergency}
                                className="flex-1 bg-red-600 hover:bg-red-700 rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg shadow-red-900/20"
                            >
                                <AlertTriangle size={64} className="mb-4" />
                                <span className="text-2xl font-black uppercase tracking-widest">Emergency</span>
                                <span className="text-sm opacity-80 mt-2">Alert Dispatch Immediately</span>
                            </button>

                            <button 
                                onClick={handleEndRoute}
                                className="h-32 bg-slate-700 hover:bg-slate-600 border-2 border-slate-500 hover:border-white rounded-2xl flex items-center justify-center gap-4 transition-all"
                            >
                                <Power size={32} className="text-slate-300" />
                                <span className="text-xl font-bold">Complete Route</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DriverApp;
