
import React, { useState, useEffect } from 'react';
import { BusRoute, BusStatus } from '../types';
import { Bus, Navigation, CheckCircle2, AlertTriangle, Gauge, Power, LogOut, MapPin, Satellite, X, Save, Clock, Send } from 'lucide-react';

interface DriverAppProps {
    routes: BusRoute[];
    onUpdateStatus: (busId: string, status: BusStatus, alert?: string) => void;
}

const DriverApp: React.FC<DriverAppProps> = ({ routes, onUpdateStatus }) => {
    const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
    const [isOnRoute, setIsOnRoute] = useState(false);
    const [showPreTrip, setShowPreTrip] = useState(false);
    const [usingRealGPS, setUsingRealGPS] = useState(false);
    const [gpsCoords, setGpsCoords] = useState<{lat: number, lng: number} | null>(null);
    
    // Interaction States
    const [showDelayMenu, setShowDelayMenu] = useState(false);
    const [showOdometerInput, setShowOdometerInput] = useState(false);
    const [odometer, setOdometer] = useState(45200);
    const [emergencyActive, setEmergencyActive] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    const [checklist, setChecklist] = useState({
        tires: false,
        lights: false,
        fluids: false,
        brakes: false
    });

    const activeRoute = routes.find(r => r.id === selectedRouteId);

    // Helper to show temporary success message
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // --- REAL GPS LOGIC ---
    useEffect(() => {
        let watchId: number;
        if (isOnRoute && usingRealGPS && 'geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude, speed } = position.coords;
                    setGpsCoords({ lat: latitude, lng: longitude });
                    console.log(`[REAL GPS] Bus ${activeRoute?.busNumber}: ${latitude}, ${longitude} @ ${speed}m/s`);
                },
                (error) => console.error("GPS Error:", error),
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [isOnRoute, usingRealGPS, activeRoute]);

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
                showToast("Route Started - Dispatch Notified");
            }
        }
    };

    const handleEndRoute = () => {
        setIsOnRoute(false);
        setEmergencyActive(false);
        setChecklist({ tires: false, lights: false, fluids: false, brakes: false });
        if (activeRoute) {
            onUpdateStatus(activeRoute.id, BusStatus.COMPLETED);
            showToast("Route Ended - Logs Uploaded");
        }
    };

    const handleTrafficDelay = (reason: string) => {
        if (activeRoute) {
            onUpdateStatus(activeRoute.id, BusStatus.DELAYED, reason);
            setShowDelayMenu(false);
            showToast(`Delay Sent: ${reason}`);
        }
    };

    const handleSaveOdometer = () => {
        setShowOdometerInput(false);
        showToast(`Odometer Updated: ${odometer}`);
    };

    const reportEmergency = () => {
        if (activeRoute) {
            setEmergencyActive(true);
            onUpdateStatus(activeRoute.id, BusStatus.DELAYED, "DRIVER EMERGENCY DECLARED");
        }
    };

    if (!activeRoute) return <div className="p-8 text-center">No Routes Assigned. Contact Dispatch.</div>;

    return (
        <div className={`h-screen flex flex-col font-poppins ${emergencyActive ? 'bg-red-900 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
            
            {/* Success Toast Notification */}
            {toastMessage && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl z-[60] flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 size={20} />
                    <span className="font-bold">{toastMessage}</span>
                </div>
            )}

            <header className={`p-4 flex justify-between items-center shadow-lg ${emergencyActive ? 'bg-red-800' : 'bg-slate-800'}`}>
                <div className="flex items-center gap-3">
                    <div className={`${emergencyActive ? 'bg-white text-red-600' : 'bg-blue-600 text-white'} p-2 rounded-lg`}>
                        <Bus size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{emergencyActive ? 'EMERGENCY MODE' : 'RideSmart Driver'}</h1>
                        <p className={`text-xs ${emergencyActive ? 'text-red-200' : 'text-slate-400'}`}>Vehicle: {activeRoute.busNumber}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-bold">{activeRoute.driver}</p>
                        <p className={`text-xs ${emergencyActive ? 'text-white' : 'text-green-400'}`}>Connected</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto relative">
                {/* Traffic Delay Modal Overlay - UPDATED TO FIXED POSITIONING */}
                {showDelayMenu && (
                    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Clock className="text-orange-500" /> Select Delay Reason
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Heavy Traffic', 'Accident Ahead', 'Road Construction', 'Mechanical Issue', 'Weather Conditions', 'Passenger Issue'].map(reason => (
                                    <button 
                                        key={reason}
                                        onClick={() => handleTrafficDelay(reason)}
                                        className="p-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium text-sm transition-colors text-white"
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setShowDelayMenu(false)} className="mt-4 w-full py-3 bg-slate-900 rounded-xl font-bold text-slate-400 hover:bg-slate-950">Cancel</button>
                        </div>
                    </div>
                )}

                {/* Odometer Input Overlay - UPDATED TO FIXED POSITIONING */}
                {showOdometerInput && (
                    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl text-center">
                            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                                <Gauge className="text-blue-500" /> Update Odometer
                            </h3>
                            <div className="bg-black p-4 rounded-xl mb-6 border-2 border-slate-600">
                                <input 
                                    type="number" 
                                    value={odometer}
                                    onChange={(e) => setOdometer(parseInt(e.target.value))}
                                    className="bg-transparent text-center text-4xl font-mono text-green-400 outline-none w-full"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowOdometerInput(false)} className="flex-1 py-3 bg-slate-700 rounded-xl font-bold text-slate-300 hover:bg-slate-600">Cancel</button>
                                <button onClick={handleSaveOdometer} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white flex items-center justify-center gap-2"><Save size={18} /> Save</button>
                            </div>
                        </div>
                    </div>
                )}

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
                                className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl text-lg mb-6 text-white"
                            >
                                {routes.map(r => (
                                    <option key={r.id} value={r.id}>{r.name} ({r.busNumber})</option>
                                ))}
                            </select>
                            
                            {/* GPS Toggle */}
                            <div className="mb-6 flex items-center gap-3 bg-black/20 p-3 rounded-xl">
                                <button 
                                    onClick={() => setUsingRealGPS(!usingRealGPS)}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${usingRealGPS ? 'bg-green-500' : 'bg-slate-600'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${usingRealGPS ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                                <span className="text-sm font-bold flex items-center gap-2">
                                    <Satellite size={16} /> Use Real Device GPS
                                </span>
                            </div>

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
                        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col">
                            <div className="mb-auto">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-2 ${emergencyActive ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500/20 text-green-400'}`}>
                                    {emergencyActive ? '⚠️ EMERGENCY ACTIVE' : 'Active Route'}
                                </span>
                                <h2 className="text-3xl font-bold mb-1">{activeRoute.name}</h2>
                                <p className="text-slate-400 flex items-center gap-2"><MapPin size={16} /> Next: {activeRoute.nextStop}</p>
                                {usingRealGPS && gpsCoords && (
                                    <div className="mt-4 p-2 bg-black/40 rounded font-mono text-xs text-green-400 border border-green-900/50">
                                        LAT: {gpsCoords.lat.toFixed(5)} | LNG: {gpsCoords.lng.toFixed(5)}
                                    </div>
                                )}
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
                                <button 
                                    onClick={() => setShowDelayMenu(true)}
                                    disabled={emergencyActive}
                                    className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    <AlertTriangle className="text-orange-500" /> Report Traffic Delay
                                </button>
                                <button 
                                    onClick={() => setShowOdometerInput(true)}
                                    disabled={emergencyActive}
                                    className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    <Gauge className="text-blue-500" /> Log Odometer
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                             <button 
                                onClick={reportEmergency}
                                className={`flex-1 rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg transition-all active:scale-95 ${
                                    emergencyActive ? 'bg-red-600 animate-none ring-4 ring-red-400' : 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
                                }`}
                            >
                                <AlertTriangle size={64} className="mb-4" />
                                <span className="text-2xl font-black uppercase tracking-widest">
                                    {emergencyActive ? 'HELP ON THE WAY' : 'Emergency'}
                                </span>
                                <span className="text-sm opacity-80 mt-2">
                                    {emergencyActive ? 'Dispatch Notified - Stay Calm' : 'Alert Dispatch Immediately'}
                                </span>
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
