// Exported Types
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
    tirePressure: number; // PSI
    oilLevel: number; // percentage
}

export interface BusRoute {
  id: string;
  name: string;
  driver: string;
  busNumber: string;
  status: BusStatus;
  capacity: number; // Maximum student capacity
  occupancy: number;
  nextStop: string;
  estimatedArrival: string; // HH:MM format
  coordinates: { x: number; y: number }; // For schematic map (0-100)
  alert?: string;
  vehicleType: VehicleType;
  health?: BusHealth;
  
  // Detailed Vehicle Info
  vin?: string;
  licensePlate?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;

  // Event fields
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

export type BudgetCategory = 
  | 'Fuel/Gas' 
  | 'Staff Salaries' 
  | 'Maintenance' 
  | 'Leases/Purchases' 
  | 'Insurance' 
  | 'Technology' 
  | 'Facilities';

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
}