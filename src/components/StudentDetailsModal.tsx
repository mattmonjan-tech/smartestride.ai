import React, { useState } from 'react';
import { Student, StudentStatus, BusRoute } from '../types';
import { X, Bus, MapPin, Clock, User, Calendar, Edit2, Save, Wifi, Zap, Check, Camera, Loader2, FileText, Activity } from 'lucide-react';

interface StudentDetailsModalProps {
  student: Student;
  routes: BusRoute[];
  onClose: () => void;
  onUpdate?: (student: Student) => void;
}

interface LocalLog {
    id: string;
    timestamp: string;
    tag: string;
    action: string;
    details: string;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student: initialStudent, routes, onClose, onUpdate }) => {
    // Local state to manage immediate updates within the modal (simulating a real-time refresh)
    const [student, setStudent] = useState(initialStudent);
    const [isEditingId, setIsEditingId] = useState(false);
    const [rfidTag, setRfidTag] = useState(student.rfidTag);
    const [isScanning, setIsScanning] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [localLogs, setLocalLogs] = useState<LocalLog[]>([]);

    // Generate some mock history for the demo to visualize the timeline feature
    const mockHistory = [
        {
            date: 'Today',
            events: [
                { 
                    time: student.lastScanTime || '07:45', 
                    action: student.status === StudentStatus.ON_BUS ? 'Boarded Bus' : 'Disembarked', 
                    location: student.lastScanLocation || 'Home Stop',
                    isRecent: true
                },
                { 
                    time: '07:15', 
                    action: 'Arrived at Stop', 
                    location: 'Home Stop',
                    isRecent: false
                }
            ]
        },
        {
            date: 'Yesterday',
            events: [
                { time: '15:45', action: 'Disembarked', location: 'Home Stop', isRecent: false },
                { time: '15:15', action: 'Boarded Bus', location: student.school, isRecent: false },
                { time: '07:50', action: 'Disembarked', location: student.school, isRecent: false },
                { time: '07:30', action: 'Boarded Bus', location: 'Home Stop', isRecent: false }
            ]
        }
    ];

    const handleSaveRfid = () => {
        // Update local student state to reflect the change "persisting"
        const updatedStudent = { ...student, rfidTag: rfidTag };
        setStudent(updatedStudent);
        if (onUpdate) onUpdate(updatedStudent);

        setIsEditingId(false);
        setSaveSuccess(true);
        
        // Clear success message after 2 seconds
        setTimeout(() => {
            setSaveSuccess(false);
        }, 2000);

        // In a real app, this would make an API call to update the database association
        console.log(`Provisioned Card ${rfidTag} to Student ${student.id}`);
    };

    const simulateHardwareScan = () => {
        setIsScanning(true);
        
        // Simulate network latency + hardware processing (800ms)
        setTimeout(() => {
            // 1. Toggle Status (On Bus <-> Off Bus)
            const newStatus = student.status === StudentStatus.ON_BUS ? StudentStatus.OFF_BUS : StudentStatus.ON_BUS;
            const now = new Date().toLocaleTimeString('en-US', { hour12: false });
            
            let newLocation = 'Unknown Location';
            let detectedBusId = student.assignedBusId;

            // 2. Randomly pick a bus from the fleet to simulate proximity detection
            // Prioritize active buses for realism
            const activeBuses = routes.filter(r => r.status === 'On Route' || r.status === 'Delayed');
            const candidateBuses = activeBuses.length > 0 ? activeBuses : routes;

            if (candidateBuses.length > 0) {
                const randomBus = candidateBuses[Math.floor(Math.random() * candidateBuses.length)];
                detectedBusId = randomBus.id;
                
                // Mock mapping schematic X/Y to Tucson GPS coordinates for realism
                // Base: 32.2226° N, 110.9747° W
                const latOffset = (randomBus.coordinates.y - 50) * 0.001;
                const lngOffset = (randomBus.coordinates.x - 50) * 0.001;
                const lat = (32.2226 + latOffset).toFixed(6);
                const lng = (-110.9747 + lngOffset).toFixed(6);
                
                // 3. Update Last Scan Location with Bus Number and GPS
                newLocation = `GPS: ${lat}, ${lng} • Bus ${randomBus.busNumber}`;
            } else {
                 newLocation = newStatus === StudentStatus.ON_BUS ? 'School Boarding Zone' : 'Drop-off Zone';
            }
            
            const updatedStudent = {
                ...student,
                status: newStatus,
                lastScanTime: now,
                lastScanLocation: newLocation,
                assignedBusId: detectedBusId // Update bus ID based on the scan
            };
            
            // Update Student State
            setStudent(updatedStudent);
            if (onUpdate) onUpdate(updatedStudent);

            // Create System Log Entry
            const newLog: LocalLog = {
                id: `log-${Date.now()}`,
                timestamp: now,
                tag: student.rfidTag,
                action: newStatus === StudentStatus.ON_BUS ? 'CHECK_IN' : 'CHECK_OUT',
                details: `Detected at ${newLocation}`
            };
            setLocalLogs(prev => [newLog, ...prev]);
            
            setIsScanning(false);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 duration-300">
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 flex justify-between items-start shrink-0">
                    <div className="flex gap-5">
                        {/* Student Photo Component */}
                        <div className="relative shrink-0 group">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-2 ring-indigo-400/50 bg-slate-800 flex items-center justify-center">
                                {student.photoUrl ? (
                                    <img 
                                        src={student.photoUrl} 
                                        alt={student.name} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-indigo-100">
                                        <User size={40} strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-full shadow-md border-2 border-slate-900 transition-colors">
                                <Camera size={14} />
                            </button>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{student.name}</h2>
                            <div className="flex flex-wrap items-center gap-3 text-slate-300 text-sm mt-2">
                                <span className="px-2.5 py-0.5 bg-slate-800 rounded-md border border-slate-700 font-mono text-xs text-slate-400">ID: {student.id}</span>
                                <span className="px-2.5 py-0.5 bg-slate-800 rounded-md border border-slate-700 font-medium text-slate-300">Grade {student.grade}</span>
                                
                                <span className={`px-2.5 py-0.5 rounded-md border font-bold text-xs flex items-center gap-1.5 ${
                                    student.status === StudentStatus.ON_BUS ? 'bg-green-900/40 text-green-400 border-green-700/50' :
                                    student.status === StudentStatus.ABSENT ? 'bg-red-900/40 text-red-400 border-red-700/50' :
                                    'bg-slate-700 text-slate-300 border-slate-600'
                                }`}>
                                    {student.status === StudentStatus.ON_BUS ? <Bus size={12} /> : <MapPin size={12} />}
                                    {student.status}
                                </span>

                                <span className="px-2.5 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded-md font-mono text-xs font-bold flex items-center gap-1.5 text-indigo-300 shadow-sm shadow-indigo-500/10">
                                    <Wifi size={12} /> 
                                    <span className="tracking-wider">{student.rfidTag}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-white hover:bg-white/10 transition-all p-2 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* RFID Provisioning Section */}
                    <div className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="bg-white p-3 rounded-lg shadow-sm text-indigo-600 ring-1 ring-indigo-100 shrink-0">
                                <Wifi size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide">RFID Configuration</p>
                                {isEditingId ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input 
                                            type="text" 
                                            value={rfidTag}
                                            onChange={(e) => setRfidTag(e.target.value)}
                                            className="px-2 py-1 text-sm border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none w-32 font-mono uppercase"
                                            autoFocus
                                        />
                                        <button onClick={handleSaveRfid} className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                            <Save size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mt-1 group cursor-pointer relative" onClick={() => setIsEditingId(true)}>
                                        <p className="text-lg font-bold text-indigo-900 font-mono">{rfidTag}</p>
                                        <Edit2 size={12} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        {saveSuccess && (
                                            <span className="absolute left-full ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 animate-in fade-in slide-in-from-left-2 whitespace-nowrap">
                                                <Check size={10} /> Saved
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="w-full md:w-auto">
                            <button 
                                onClick={simulateHardwareScan}
                                disabled={isScanning}
                                className="w-full md:w-auto px-4 py-2 bg-white border border-indigo-200 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isScanning ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-indigo-600" />
                                        Scanning...
                                    </span>
                                ) : (
                                    <>
                                        <Zap size={16} className="fill-indigo-700" /> Simulate RFID Scan
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Status</p>
                            <div className={`flex items-center gap-2 font-bold text-lg ${
                                student.status === 'On Bus' ? 'text-blue-600' :
                                student.status === 'Absent' ? 'text-red-600' : 'text-green-600'
                            }`}>
                                {student.status === 'On Bus' ? <Bus size={20}/> : <MapPin size={20}/>}
                                {student.status}
                            </div>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">School</p>
                            <div className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                <User size={18} className="text-slate-400"/>
                                {student.school}
                            </div>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Route</p>
                            <div className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                <Bus size={20} className="text-slate-400"/>
                                {student.assignedBusId}
                            </div>
                        </div>
                    </div>

                    {/* History Timeline */}
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Calendar size={20} className="text-slate-400" />
                        Ridership History
                    </h3>
                    <div className="space-y-8 mb-8">
                        {mockHistory.map((day, idx) => (
                            <div key={idx}>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pl-2 border-l-2 border-slate-200">{day.date}</h4>
                                <div className="space-y-0 relative pl-4 border-l-2 border-slate-100 ml-2">
                                    {day.events.map((event, eIdx) => (
                                        <div key={eIdx} className="relative pb-8 last:pb-0 group">
                                            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 transition-all ${
                                                event.isRecent 
                                                    ? 'bg-blue-500 border-blue-500 ring-4 ring-blue-100' 
                                                    : 'bg-white border-slate-300 group-hover:border-blue-400'
                                            }`}></div>
                                            <div className="flex justify-between items-start hover:bg-slate-50 -m-2 p-2 rounded-lg transition-colors">
                                                <div>
                                                    <p className={`font-medium ${event.isRecent ? 'text-blue-700' : 'text-slate-700'}`}>{event.action}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <MapPin size={10} />
                                                        {event.location}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                    <Clock size={12} />
                                                    {event.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* System Debug Logs */}
                    {localLogs.length > 0 && (
                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Activity size={16} className="text-slate-400" />
                                Live Hardware Logs
                            </h3>
                            <div className="bg-slate-900 rounded-lg p-4 overflow-hidden">
                                <div className="space-y-2 font-mono text-xs">
                                    {localLogs.map((log) => (
                                        <div key={log.id} className="flex gap-3 items-start text-slate-300 border-b border-slate-800 pb-2 last:border-0 last:pb-0 animate-in slide-in-from-left-2">
                                            <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                                            <div className="flex-1">
                                                <span className="text-indigo-400 font-bold mr-2">[{log.tag}]</span>
                                                <span className="text-white">{log.action}</span>
                                                <span className="block text-slate-500 mt-0.5">{log.details}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2.5 text-slate-600 font-medium hover:bg-white hover:text-slate-800 rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm hover:shadow"
                    >
                        Close
                    </button>
                    <button className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                        <span>Contact Guardian</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudentDetailsModal;
