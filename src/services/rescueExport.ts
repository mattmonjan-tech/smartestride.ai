import { INITIAL_ROUTES, INITIAL_STUDENTS, INITIAL_LOGS, INITIAL_TICKETS, INITIAL_BUDGET_DATA, RECOMMENDED_HARDWARE, MOCK_TENANTS, MOCK_INVOICES, MOCK_POS, MOCK_QUOTES, INITIAL_PRICING_CONFIG } from '../constants';

const getConstantsContent = () => `import { BusRoute, BusStatus, Student, StudentStatus, LogEntry, Tenant, Invoice, QuoteRequest, PurchaseOrder, DeviceGuide, PricingConfig, BudgetEntry, MaintenanceTicket } from "./types";

export const INITIAL_ROUTES: BusRoute[] = ${JSON.stringify(INITIAL_ROUTES, null, 2)};
export const INITIAL_STUDENTS: Student[] = ${JSON.stringify(INITIAL_STUDENTS, null, 2)};
export const INITIAL_LOGS: LogEntry[] = ${JSON.stringify(INITIAL_LOGS, null, 2)};
export const INITIAL_TICKETS: MaintenanceTicket[] = ${JSON.stringify(INITIAL_TICKETS, null, 2)};
export const RECOMMENDED_HARDWARE: DeviceGuide[] = ${JSON.stringify(RECOMMENDED_HARDWARE, null, 2)};
export const MOCK_TENANTS: Tenant[] = ${JSON.stringify(MOCK_TENANTS, null, 2)};
export const MOCK_INVOICES: Invoice[] = ${JSON.stringify(MOCK_INVOICES, null, 2)};
export const MOCK_QUOTES: QuoteRequest[] = ${JSON.stringify(MOCK_QUOTES, null, 2)};
export const MOCK_POS: PurchaseOrder[] = ${JSON.stringify(MOCK_POS, null, 2)};
export const INITIAL_PRICING_CONFIG: PricingConfig = ${JSON.stringify(INITIAL_PRICING_CONFIG, null, 2)};
export const INITIAL_BUDGET_DATA: BudgetEntry[] = ${JSON.stringify(INITIAL_BUDGET_DATA, null, 2)};
`;

export const getProjectFiles = () => {
    const files: Record<string, string> = {};

    // 1. Configuration Files
    files['package.json'] = `{
  "name": "ridesmart-app",
  "private": true,
  "version": "46.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "*",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.3",
    "file-saver": "^2.0.5",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "@types/file-saver": "^2.0.7",
    "@types/node": "^20.10.0"
  }
}`;

    files['tsconfig.json'] = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;

    files['tsconfig.node.json'] = `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`;

    files['vite.config.ts'] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})`;

    files['vercel.json'] = `{
  "installCommand": "npm install --no-package-lock --force",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}`;

    files['index.html'] = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>TUSD RideSmart</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`;

    // 2. Source Files
    files['src/index.tsx'] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

    files['src/index.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  background-color: #f3f4f6;
}
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}`;

    // 3. Full App Content
    // We carefully escape backticks and ${} to ensure this string is valid TypeScript code when written to file
    files['src/App.tsx'] = `import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Map as MapIcon, Users, Bell, Settings, Bus, LogOut, Search, ChevronRight, Pencil, User, GitMerge, AlertTriangle, Check, Cable, Upload, X, Shield, Calendar, Lock, DollarSign, Wrench, Tag 
} from 'lucide-react';
import DashboardMetrics from './components/DashboardMetrics';
import SimulatedMap from './components/SimulatedMap';
import AiLogistics from './components/AiLogistics';
import StudentDetailsModal from './components/StudentDetailsModal';
import EditRouteModal from './components/EditRouteModal';
import RouteOptimizer from './components/RouteOptimizer';
import HardwareSetup from './components/HardwareSetup';
import FleetImportModal from './components/FleetImportModal';
import ParentPortal from './components/ParentPortal';
import LandingPage from './components/LandingPage';
import SpecialEvents from './components/SpecialEvents';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import BudgetPlanner from './components/BudgetPlanner';
import MaintenanceConsole from './components/MaintenanceConsole';
import TelematicsIntegration from './components/TelematicsIntegration';
import DriverApp from './components/DriverApp';
import RescueDeploy from './components/RescueDeploy';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MaintenanceModal from './components/MaintenanceModal';
import { INITIAL_ROUTES, INITIAL_STUDENTS, INITIAL_LOGS, MOCK_QUOTES, INITIAL_BUDGET_DATA, INITIAL_TICKETS } from './constants';
import { BusRoute, Student, LogEntry, StudentStatus, BusStatus, SubscriptionTier, QuoteRequest, SystemSettings, MaintenanceTicket } from './types';
import { initSupabase } from './services/supabaseService';

const RfidLogList: React.FC<{ logs: LogEntry[] }> = ({ logs }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Live RFID Events</h3>
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Live Stream</span>
        </div>
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {logs.map((log) => (
                <div key={log.id} className={\`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-3 animate-in slide-in-from-left-2 duration-300 \${log.type === 'WRONG_BUS' ? 'bg-red-50' : ''}\`}>
                    <div className={\`mt-1 w-2 h-2 rounded-full shrink-0 \${log.severity === 'warning' ? 'bg-orange-500' : log.severity === 'critical' ? 'bg-red-500' : 'bg-blue-500'}\`} />
                    <div>
                        <p className={\`text-sm \${log.severity === 'critical' ? 'text-red-700 font-bold' : 'text-slate-800'}\`}>
                            {log.type === 'WRONG_BUS' && <span className="uppercase mr-1">[Safety Alert]</span>}
                            {log.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-mono">{log.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'CLIENT' | 'ADMIN' | 'DRIVER' | 'MAINTENANCE'>('CLIENT');
  const [tier, setTier] = useState<SubscriptionTier>('ENTERPRISE');
  const [adminQuotes, setAdminQuotes] = useState<QuoteRequest[]>(() => {
      const saved = localStorage.getItem('rideSmartQuotes');
      return saved ? JSON.parse(saved) : MOCK_QUOTES;
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
      const saved = localStorage.getItem('rideSmartSettings');
      return saved ? JSON.parse(saved) : { mapProvider: 'SIMULATED' };
  });
  useEffect(() => {
      if (systemSettings.supabaseUrl && systemSettings.supabaseKey) {
          initSupabase(systemSettings.supabaseUrl, systemSettings.supabaseKey);
      }
  }, [systemSettings.supabaseUrl, systemSettings.supabaseKey]); 
  useEffect(() => { localStorage.setItem('rideSmartQuotes', JSON.stringify(adminQuotes)); }, [adminQuotes]);
  useEffect(() => { localStorage.setItem('rideSmartSettings', JSON.stringify(systemSettings)); }, [systemSettings]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet' | 'students' | 'optimizer' | 'hardware' | 'parent' | 'events' | 'budget' | 'maintenance'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingRoute, setEditingRoute] = useState<BusRoute | null>(null);
  const [showFleetImport, setShowFleetImport] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState<{ students: Student[], routes: BusRoute[] }>({ students: [], routes: [] });
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const features = {
    aiLogistics: tier === 'ENTERPRISE',
    optimizer: tier === 'ENTERPRISE',
    events: tier === 'ENTERPRISE',
    budget: tier === 'ENTERPRISE',
    parentPortal: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE',
    hardware: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE',
    maintenance: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE'
  };
  const handleLogin = (role: 'CLIENT' | 'ADMIN' | 'DRIVER' | 'MAINTENANCE', simulatedTier: SubscriptionTier = 'ENTERPRISE') => {
      setUserRole(role);
      setTier(simulatedTier);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
  };
  const handleNewQuote = (newQuote: QuoteRequest) => { setAdminQuotes(prev => [newQuote, ...prev]); };
  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults({ students: [], routes: [] }); return; }
    const lowerQuery = searchQuery.toLowerCase();
    const matchedStudents = students.filter(s => s.name.toLowerCase().includes(lowerQuery) || s.id.toLowerCase().includes(lowerQuery)).slice(0, 5);
    const matchedRoutes = routes.filter(r => r.name.toLowerCase().includes(lowerQuery) || r.busNumber.toLowerCase().includes(lowerQuery)).slice(0, 5);
    setSearchResults({ students: matchedStudents, routes: matchedRoutes });
  }, [searchQuery, students, routes]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) { setSearchQuery(''); }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) { setShowNotifications(false); }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setRoutes(currentRoutes => currentRoutes.map(bus => {
        if (bus.status === BusStatus.MAINTENANCE) return bus;
        let newCoords = bus.coordinates;
        if (bus.status === BusStatus.ON_ROUTE || bus.status === BusStatus.DELAYED) {
            const dx = (Math.random() - 0.5) * 2;
            const dy = (Math.random() - 0.5) * 2;
            newCoords = { x: Math.max(5, Math.min(95, bus.coordinates.x + dx)), y: Math.max(5, Math.min(95, bus.coordinates.y + dy)) };
        }
        let newAlert = bus.alert;
        let newStatus = bus.status;
        if (!newAlert && (bus.status === BusStatus.ON_ROUTE) && Math.random() < 0.02) {
            newAlert = "Traffic Jam on I-10";
            newStatus = BusStatus.DELAYED;
        }
        return { ...bus, coordinates: newCoords, alert: newAlert, status: newStatus };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const handleDismissAlert = (busId: string) => {
      setRoutes(currentRoutes => currentRoutes.map(r => { if (r.id === busId) { return { ...r, alert: undefined, status: r.status === BusStatus.DELAYED ? BusStatus.ON_ROUTE : r.status }; } return r; }));
  };
  const handleReportMechanicalIssue = (busId: string, busNumber: string) => {
      const newTicket: MaintenanceTicket = { id: \`M-\${Date.now()}\`, busId, busNumber, issue: 'Driver Reported Mechanical Issue', reportedBy: 'Driver App', reportedAt: new Date().toLocaleString(), status: 'OPEN', priority: 'MEDIUM', progress: 0, estimatedCompletion: 'TBD', notes: [] };
      setMaintenanceTickets(prev => [newTicket, ...prev]);
      setRoutes(prev => prev.map(r => r.id === busId ? { ...r, status: BusStatus.MAINTENANCE, alert: undefined } : r));
  };
  if (!isLoggedIn) { return <LandingPage onLogin={handleLogin} onQuoteRequest={handleNewQuote} />; }
  if (userRole === 'ADMIN') { return <SuperAdminDashboard onImpersonate={(t) => { setUserRole('CLIENT'); setActiveTab('dashboard'); }} quotes={adminQuotes} systemSettings={systemSettings} onUpdateSettings={(s) => { setSystemSettings(s); if (s.supabaseUrl && s.supabaseKey) initSupabase(s.supabaseUrl, s.supabaseKey); }} />; }
  if (userRole === 'DRIVER') { return <DriverApp routes={routes} onUpdateStatus={(id, status, alert) => setRoutes(prev => prev.map(r => r.id === id ? { ...r, status, alert } : r))} />; }
  if (userRole === 'MAINTENANCE') { return <div className="h-screen bg-slate-50 flex flex-col"><div className="bg-slate-900 text-white p-4 flex justify-between"><h1 className="font-bold">Shop Portal</h1><button onClick={() => setIsLoggedIn(false)}><LogOut size={20}/></button></div><div className="flex-1 p-6"><MaintenanceConsole tickets={maintenanceTickets} routes={routes} onUpdateTicket={(t) => setMaintenanceTickets(prev => prev.map(x => x.id === t.id ? t : x))} onResolveTicket={(tid, bid) => { setRoutes(prev => prev.map(r => r.id === bid ? { ...r, status: BusStatus.IDLE } : r)); }} onCreateTicket={(t) => setMaintenanceTickets(prev => [t, ...prev])} onImportFleet={() => setShowFleetImport(true)} /></div>{showFleetImport && <FleetImportModal onImport={(newRoutes) => { setRoutes(prev => [...prev, ...newRoutes]); setShowFleetImport(false); }} onClose={() => setShowFleetImport(false)} />}</div>; }
  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800"><h1 className="font-bold text-white">TUSD RideSmart</h1></div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"><LayoutDashboard size={20}/><span>Dashboard</span></button>
          <button onClick={() => setActiveTab('fleet')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"><MapIcon size={20}/><span>Fleet Map</span></button>
          <button onClick={() => setActiveTab('students')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"><Users size={20}/><span>Students</span></button>
          {features.events && <button onClick={() => setActiveTab('events')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"><Calendar size={20}/><span>Events</span></button>}
          {features.optimizer && <button onClick={() => setActiveTab('optimizer')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"><GitMerge size={20}/><span>Optimizer</span></button>}
          <div className="pt-4 mt-4 border-t border-slate-800"><p className="text-xs uppercase px-4 mb-2">Admin</p>
             {features.maintenance && <button onClick={() => setActiveTab('maintenance')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"><Wrench size={20}/><span>Maintenance</span></button>}
             {features.budget && <button onClick={() => setActiveTab('budget')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"><DollarSign size={20}/><span>Budget</span></button>}
             {features.hardware && <button onClick={() => setActiveTab('hardware')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"><Cable size={20}/><span>Settings</span></button>}
             {features.parentPortal && <button onClick={() => setActiveTab('parent')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"><Shield size={20}/><span>Parents</span></button>}
          </div>
        </nav>
        <div className="p-4"><button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 text-red-400"><LogOut size={18}/><span>Sign Out</span></button></div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'dashboard' && <><DashboardMetrics routes={routes} students={students}/><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 h-[500px] bg-white p-4 rounded-xl shadow-sm"><SimulatedMap routes={routes} onDismissAlert={handleDismissAlert} onReportIssue={handleReportMechanicalIssue}/></div><div className="space-y-6">{features.aiLogistics && <AiLogistics routes={routes} logs={logs} tickets={maintenanceTickets}/>}<AnalyticsDashboard routes={routes}/><RfidLogList logs={logs}/></div></div></>}
            {activeTab === 'fleet' && <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 h-full bg-white rounded-xl shadow-sm overflow-hidden"><SimulatedMap routes={routes} onDismissAlert={handleDismissAlert}/></div><div className="bg-white rounded-xl shadow-sm overflow-y-auto p-4 space-y-3">{routes.map(r => <div key={r.id} className="p-4 border rounded-xl"><h4 className="font-bold">{r.busNumber}</h4><p className="text-sm">{r.status}</p><button onClick={() => setEditingRoute(r)} className="mt-2 text-blue-600 text-sm">Edit</button></div>)}</div></div>}
            {activeTab === 'students' && <div className="bg-white rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">{students.map(s => <div key={s.id} onClick={() => setSelectedStudent(s)} className="p-4 border rounded-xl cursor-pointer hover:shadow-md"><h4 className="font-bold">{s.name}</h4><p className="text-sm">{s.school}</p><span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{s.status}</span></div>)}</div>}
            {activeTab === 'events' && <SpecialEvents routes={routes} onAddEvent={(r) => setRoutes(prev => [...prev, r])}/>}
            {activeTab === 'optimizer' && <RouteOptimizer routes={routes}/>}
            {activeTab === 'hardware' && <HardwareSetup onImportStudents={(s) => setStudents(prev => [...prev, ...s])}/>}
            {activeTab === 'parent' && <ParentPortal student={selectedStudent || students[0]} routes={routes}/>}
            {activeTab === 'budget' && <BudgetPlanner initialData={INITIAL_BUDGET_DATA}/>}
            {activeTab === 'maintenance' && <MaintenanceConsole tickets={maintenanceTickets} routes={routes} onUpdateTicket={(t) => setMaintenanceTickets(prev => prev.map(x => x.id === t.id ? t : x))} onResolveTicket={(tid, bid) => handleResolveTicket(tid, bid)} onCreateTicket={(t) => setMaintenanceTickets(prev => [t, ...prev])} onImportFleet={() => setShowFleetImport(true)}/>}
        </div>
      </main>
      {selectedStudent && <StudentDetailsModal student={selectedStudent} routes={routes} onClose={() => setSelectedStudent(null)} onUpdate={(s) => handleStudentUpdate(s)}/>}
      {editingRoute && <EditRouteModal route={editingRoute} onSave={(r) => handleSaveRoute(r)} onClose={() => setEditingRoute(null)}/>}
      {showFleetImport && <FleetImportModal onImport={(r) => handleFleetImport(r)} onClose={() => setShowFleetImport(false)}/>}
      {showMaintenanceModal && <MaintenanceModal isOpen={showMaintenanceModal} onClose={() => setShowMaintenanceModal(false)} onSubmit={(t) => setMaintenanceTickets(prev => [t, ...prev])} routes={routes}/>}
    </div>
  );
}
`;

    files['src/constants.ts'] = getConstantsContent();

    // Basic placeholders for types to satisfy build if missing
    files['src/types.ts'] = `
export enum BusStatus { ON_ROUTE='On Route', IDLE='Idle', DELAYED='Delayed', MAINTENANCE='Maintenance', COMPLETED='Completed' }
export enum StudentStatus { ON_BUS='On Bus', OFF_BUS='Off Bus', ABSENT='Absent', UNKNOWN='Unknown' }
export type SubscriptionTier = 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
export type VehicleType = 'Standard Bus' | 'Activity Bus' | 'Shuttle' | 'Wheelchair Van' | 'Electric Bus';
// Add other interfaces as needed for minimal build
export interface Student { id: string; name: string; grade: number; school: string; rfidTag: string; status: StudentStatus; assignedBusId: string; photoUrl?: string; lastScanTime?: string; lastScanLocation?: string; }
export interface BusRoute { id: string; name: string; driver: string; busNumber: string; status: BusStatus; capacity: number; occupancy: number; nextStop: string; estimatedArrival: string; coordinates: {x:number;y:number}; alert?: string; vehicleType: VehicleType; }
export interface LogEntry { id: string; timestamp: string; type: string; message: string; severity: string; }
export interface MaintenanceTicket { id: string; busId: string; busNumber: string; issue: string; reportedBy: string; reportedAt: string; status: string; priority: string; progress: number; estimatedCompletion: string; notes: string[]; }
export interface QuoteRequest { id: string; districtName: string; contactName: string; contactRole: string; email: string; studentCount: number; busCount: number; legacyBusCount?: number; tier: SubscriptionTier; amount: number; hardwareCost?: number; status: string; submittedDate: string; }
export interface SystemSettings { mapProvider: 'SIMULATED' | 'GOOGLE_MAPS'; googleMapsApiKey?: string; supabaseUrl?: string; supabaseKey?: string; }
`;

    return files;
};
