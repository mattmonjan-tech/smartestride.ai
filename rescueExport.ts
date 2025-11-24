
import { INITIAL_ROUTES, INITIAL_STUDENTS, INITIAL_LOGS, INITIAL_TICKETS, INITIAL_BUDGET_DATA, RECOMMENDED_HARDWARE, MOCK_TENANTS, MOCK_INVOICES, MOCK_POS, MOCK_QUOTES, INITIAL_PRICING_CONFIG } from '../constants';

export const getProjectFiles = () => {
    const files: Record<string, string> = {};

    // 1. Configuration Files
    files['package.json'] = `{
  "name": "ridesmart-app",
  "private": true,
  "version": "45.0.0",
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
    // Updated index.tsx with ts-ignore to fix Vercel build error
    files['src/index.tsx'] = `import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore
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

    // 3. Types and Constants (Crucial for App.tsx to work if user pastes back)
    files['src/types.ts'] = `
export enum BusStatus {
  ON_ROUTE = 'On Route',
  IDLE = 'Idle',
  DELAYED = 'Delayed',
  MAINTENANCE = 'Maintenance',
  COMPLETED = 'Completed'
}

export enum StudentStatus {
  ON_BUS = 'On Bus',
  OFF_BUS = 'Off Bus',
  ABSENT = 'Absent',
  UNKNOWN = 'Unknown'
}

export type SubscriptionTier = 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
export type VehicleType = 'Standard Bus' | 'Activity Bus' | 'Shuttle' | 'Wheelchair Van' | 'Electric Bus';

export interface Student {
  id: string;
  name: string;
  grade: number;
  school: string;
  rfidTag: string;
  status: StudentStatus;
  lastScanTime?: string;
  lastScanLocation?: string;
  assignedBusId: string;
  photoUrl?: string;
}

export interface BusHealth {
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    batteryVoltage: number;
    tirePressure: number;
    oilLevel: number;
}

export interface BusRoute {
  id: string;
  name: string;
  driver: string;
  busNumber: string;
  status: BusStatus;
  capacity: number;
  occupancy: number;
  nextStop: string;
  estimatedArrival: string;
  coordinates: { x: number; y: number };
  alert?: string;
  vehicleType: VehicleType;
  health?: BusHealth;
  vin?: string;
  licensePlate?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  type?: 'STANDARD' | 'FIELD_TRIP' | 'ATHLETICS';
  destination?: string;
  eventDate?: string;
}

export interface MaintenanceTicket {
  id: string;
  busId: string;
  busNumber: string;
  issue: string;
  reportedBy: string;
  reportedAt: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  progress: number;
  estimatedCompletion: string;
  notes: string[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'BOARDING' | 'DISEMBARKING' | 'ALERT' | 'SYSTEM' | 'WRONG_BUS' | 'MAINTENANCE';
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface AiInsight {
  title: string;
  description: string;
  type: 'optimization' | 'safety' | 'maintenance';
  confidence: number;
}

export interface OptimizationInsight {
  routeId: string;
  suggestion: string;
  impact: string;
  newPathDescription?: string;
}

export interface RouteOptimizationResponse {
  overview: string;
  insights: OptimizationInsight[];
  estimatedSavings: string;
}

export interface DeviceGuide {
  id: string;
  name: string;
  category: 'tablet' | 'scanner' | 'connector';
  description: string;
  priceRange: string;
  compatibility: string;
  imageUrl?: string;
}

export interface ParentNotification {
  id: string;
  topic: string;
  message: string;
  timestamp: string;
  read: boolean;
  aiGenerated: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  contactEmail: string;
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED';
  studentCount: number;
  busCount: number;
  joinedDate: string;
  logoUrl?: string;
  databaseSchema: string;
}

export interface QuoteRequest {
  id: string;
  districtName: string;
  contactName: string;
  contactRole: string;
  email: string;
  studentCount: number;
  busCount: number;
  legacyBusCount?: number;
  tier: SubscriptionTier;
  amount: number;
  hardwareCost?: number;
  status: 'PENDING' | 'REVIEWED' | 'APPROVED';
  submittedDate: string;
}

export interface PurchaseOrder {
  id: string;
  districtName: string;
  contactName: string;
  email: string;
  fileName: string;
  uploadDate: string;
  status: 'PROCESSING' | 'VERIFIED';
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  status: 'PAID' | 'OVERDUE' | 'SENT';
  dueDate: string;
}

export interface YearlyStats {
  totalMiles: number;
  safeTrips: number;
  onTimeRate: number;
  fuelSavedGal: number;
  topDriver: string;
  topDestination: string;
}
export interface PricingConfig {
    basePrice: number;
    perBusPrice: number;
}
export interface SystemSettings {
    mapProvider: 'SIMULATED' | 'GOOGLE_MAPS';
    googleMapsApiKey?: string;
    supabaseUrl?: string;
    supabaseKey?: string;
}

export type BudgetCategory = 'Fuel/Gas' | 'Staff Salaries' | 'Maintenance' | 'Leases/Purchases' | 'Insurance' | 'Technology' | 'Facilities';

export interface BudgetEntry {
  id: string;
  category: BudgetCategory;
  description: string;
  amount: number;
  date: string;
  fiscalYear: number;
}

export interface FinancialInsight {
  title: string;
  finding: string;
  recommendation: string;
  potentialSavings: number;
}

export type TelematicsProvider = 'GEOTAB' | 'SAMSARA' | 'ZONAR' | 'NATIVE';

export interface TelematicsConfig {
  provider: TelematicsProvider;
  apiKey?: string;
  refreshRateSeconds: number;
  isConnected: boolean;
}

export interface TelemetryData {
  busId: string;
  speed: number;
  rpm: number;
  fuelLevel: number;
  odometer: number;
  engineTemp: number;
  timestamp: string;
  faultCodes: string[];
}`;

    files['src/constants.ts'] = `import { BusRoute, BusStatus, Student, StudentStatus, LogEntry, Tenant, Invoice, QuoteRequest, PurchaseOrder, DeviceGuide, PricingConfig, BudgetEntry, MaintenanceTicket } from "./types";

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

    // 4. Recovery App.tsx
    files['src/App.tsx'] = `
import React from 'react';
import { Wrench } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-green-600 p-4 rounded-full mb-6 shadow-lg shadow-green-900/50 animate-pulse">
        <Wrench size={48} />
      </div>
      <h1 className="text-4xl font-bold mb-4">Recovery Mode v45</h1>
      <p className="text-slate-400 max-w-md mb-8 text-lg">
        Vercel deployment structure has been repaired.
        <br/><br/>
        <strong>Action Required:</strong> Restore your source code components to the <code>src/components</code> folder.
      </p>
    </div>
  );
}
`;

    return files;
};
