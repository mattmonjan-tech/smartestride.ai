import { BusRoute, BusStatus, Student, StudentStatus, LogEntry, Tenant, Invoice, QuoteRequest, PurchaseOrder, DeviceGuide, PricingConfig, BudgetEntry, MaintenanceTicket } from "./types";

export const INITIAL_ROUTES: BusRoute[] = [
  {
    "id": "R-101",
    "name": "Sabino Canyon Express",
    "driver": "Maria Rodriguez",
    "busNumber": "B-42",
    "status": "On Route",
    "capacity": 60,
    "occupancy": 45,
    "nextStop": "Sunrise & Kolb",
    "estimatedArrival": "07:45",
    "coordinates": {
      "x": 20,
      "y": 30
    },
    "vehicleType": "Standard Bus",
    "type": "STANDARD"
  },
  {
    "id": "R-104",
    "name": "Downtown Connector",
    "driver": "James Smith",
    "busNumber": "B-18",
    "status": "Delayed",
    "capacity": 60,
    "occupancy": 58,
    "nextStop": "Tucson High Magnet",
    "estimatedArrival": "07:55",
    "coordinates": {
      "x": 55,
      "y": 60
    },
    "alert": "Heavy Traffic on Broadway",
    "vehicleType": "Electric Bus",
    "type": "STANDARD"
  },
  {
    "id": "R-202",
    "name": "Westside Loop",
    "driver": "David Chen",
    "busNumber": "B-09",
    "status": "On Route",
    "capacity": 48,
    "occupancy": 12,
    "nextStop": "Pima College West",
    "estimatedArrival": "07:30",
    "coordinates": {
      "x": 80,
      "y": 20
    },
    "vehicleType": "Standard Bus",
    "type": "STANDARD"
  },
  {
    "id": "R-305",
    "name": "Foothills Shuttle",
    "driver": "Sarah Johnson",
    "busNumber": "B-33",
    "status": "Maintenance",
    "capacity": 60,
    "occupancy": 0,
    "nextStop": "Depot",
    "estimatedArrival": "--:--",
    "coordinates": {
      "x": 10,
      "y": 80
    },
    "vehicleType": "Shuttle",
    "type": "STANDARD"
  },
  {
    "id": "E-501",
    "name": "Science Center Field Trip",
    "driver": "Robert Fox",
    "busNumber": "B-99",
    "status": "Idle",
    "capacity": 50,
    "occupancy": 0,
    "nextStop": "Flandrau Science Center",
    "estimatedArrival": "10:00",
    "coordinates": {
      "x": 40,
      "y": 40
    },
    "vehicleType": "Activity Bus",
    "type": "FIELD_TRIP",
    "destination": "Flandrau Science Center",
    "eventDate": "2024-05-20"
  },
  {
    "id": "E-502",
    "name": "Varsity Football vs Mesa",
    "driver": "Coach Miller",
    "busNumber": "B-88",
    "status": "Idle",
    "capacity": 50,
    "occupancy": 0,
    "nextStop": "Mesa High School",
    "estimatedArrival": "16:30",
    "coordinates": {
      "x": 60,
      "y": 60
    },
    "vehicleType": "Activity Bus",
    "type": "ATHLETICS",
    "destination": "Mesa High School",
    "eventDate": "2024-09-15"
  }
];
export const INITIAL_STUDENTS: Student[] = [
  {
    "id": "S-1001",
    "name": "Leo Carter",
    "grade": 5,
    "school": "Lineweaver Elementary",
    "rfidTag": "RF-9928",
    "status": "On Bus",
    "assignedBusId": "R-101",
    "photoUrl": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop"
  },
  {
    "id": "S-1002",
    "name": "Mia Wallace",
    "grade": 11,
    "school": "Tucson High",
    "rfidTag": "RF-1123",
    "status": "Off Bus",
    "assignedBusId": "R-104",
    "lastScanTime": "07:15",
    "lastScanLocation": "Stop #4"
  },
  {
    "id": "S-1003",
    "name": "Sam Bennett",
    "grade": 3,
    "school": "Manzo Elementary",
    "rfidTag": "RF-4451",
    "status": "Absent",
    "assignedBusId": "R-202"
  },
  {
    "id": "S-1004",
    "name": "Olivia Davis",
    "grade": 8,
    "school": "Mansfeld Middle",
    "rfidTag": "RF-8821",
    "status": "On Bus",
    "assignedBusId": "R-101"
  },
  {
    "id": "S-1005",
    "name": "Ethan Wright",
    "grade": 12,
    "school": "Palo Verde High",
    "rfidTag": "RF-3321",
    "status": "Unknown",
    "assignedBusId": "R-104"
  }
];
export const INITIAL_LOGS: LogEntry[] = [
  {
    "id": "L-001",
    "timestamp": "07:42:10",
    "type": "BOARDING",
    "message": "Leo Carter (S-1001) boarded Bus B-42 at Stop #3",
    "severity": "info"
  },
  {
    "id": "L-002",
    "timestamp": "07:40:05",
    "type": "ALERT",
    "message": "Bus B-18 reported 10m delay due to traffic.",
    "severity": "warning"
  },
  {
    "id": "L-003",
    "timestamp": "07:38:22",
    "type": "DISEMBARKING",
    "message": "Mia Wallace (S-1002) disembarked Bus B-18 at Stop #4",
    "severity": "info"
  },
  {
    "id": "L-004",
    "timestamp": "07:35:00",
    "type": "SYSTEM",
    "message": "Daily route optimization check completed.",
    "severity": "info"
  }
];
export const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    "id": "M-101",
    "busId": "R-305",
    "busNumber": "B-33",
    "issue": "Brake Line Inspection",
    "reportedBy": "Telematics Alert (Code P2201)",
    "reportedAt": "2024-05-18",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "progress": 65,
    "estimatedCompletion": "4 hours",
    "notes": [
      "Mechanic dispatched.",
      "Parts ordered.",
      "Technician currently replacing rear calipers."
    ]
  },
  {
    "id": "M-102",
    "busId": "R-202",
    "busNumber": "B-09",
    "issue": "Intermittent AC Failure",
    "reportedBy": "Driver (David Chen)",
    "reportedAt": "2024-05-19",
    "status": "OPEN",
    "priority": "MEDIUM",
    "progress": 0,
    "estimatedCompletion": "1 day",
    "notes": [
      "Driver reports AC stops blowing cold when idle."
    ]
  }
];
export const RECOMMENDED_HARDWARE: DeviceGuide[] = [
  {
    "id": "dev-1",
    "name": "Apple iPad (9th Gen or newer)",
    "category": "tablet",
    "description": "Standard reliable tablet for Kiosk App. Requires Lightning to USB adapter for wired scanners.",
    "priceRange": "$250 - $330",
    "compatibility": "iOS 15+"
  },
  {
    "id": "dev-2",
    "name": "Samsung Galaxy Tab A8",
    "category": "tablet",
    "description": "Cost-effective Android option. Supports direct USB-C scanner connection.",
    "priceRange": "$180 - $230",
    "compatibility": "Android 11+"
  },
  {
    "id": "dev-3",
    "name": "Zebra DS2200 Series",
    "category": "scanner",
    "description": "Industry standard 1D/2D scanner. Rugged build for bus environments.",
    "priceRange": "$120 - $150",
    "compatibility": "USB HID (Keyboard Mode)"
  },
  {
    "id": "dev-4",
    "name": "Simple USB RFID Reader (125kHz)",
    "category": "scanner",
    "description": "Generic plug-and-play reader. Good for testing or low-cost deployment.",
    "priceRange": "$15 - $30",
    "compatibility": "USB HID"
  },
  {
    "id": "dev-5",
    "name": "Lightning to USB Camera Adapter",
    "category": "connector",
    "description": "Required for connecting USB scanners to iPads with Lightning ports.",
    "priceRange": "$29",
    "compatibility": "Lightning iPads"
  }
];
export const MOCK_TENANTS: Tenant[] = [
  {
    "id": "T-001",
    "name": "Tucson Unified (TUSD)",
    "contactEmail": "transport@tusd1.org",
    "status": "ACTIVE",
    "studentCount": 39000,
    "busCount": 240,
    "joinedDate": "2023-08-15",
    "databaseSchema": "schema_tusd_prod"
  },
  {
    "id": "T-002",
    "name": "Mesa Public Schools",
    "contactEmail": "admin@mpsaz.org",
    "status": "ACTIVE",
    "studentCount": 64000,
    "busCount": 415,
    "joinedDate": "2024-01-10",
    "databaseSchema": "schema_mesa_prod"
  },
  {
    "id": "T-003",
    "name": "Phoenix Union",
    "contactEmail": "logistics@phoenixunion.org",
    "status": "TRIAL",
    "studentCount": 28000,
    "busCount": 180,
    "joinedDate": "2024-03-01",
    "databaseSchema": "schema_phx_trial"
  }
];
export const MOCK_INVOICES: Invoice[] = [
  {
    "id": "INV-2024-001",
    "tenantId": "T-001",
    "tenantName": "Tucson Unified",
    "amount": 12500,
    "status": "PAID",
    "dueDate": "2024-04-01"
  },
  {
    "id": "INV-2024-002",
    "tenantId": "T-002",
    "tenantName": "Mesa Public Schools",
    "amount": 18200,
    "status": "SENT",
    "dueDate": "2024-05-01"
  },
  {
    "id": "INV-2024-003",
    "tenantId": "T-003",
    "tenantName": "Phoenix Union",
    "amount": 0,
    "status": "SENT",
    "dueDate": "2024-05-15"
  }
];
export const MOCK_QUOTES: QuoteRequest[] = [
  {
    "id": "Q-101",
    "districtName": "Chandler Unified",
    "contactName": "Sarah Connors",
    "contactRole": "Director of Transport",
    "email": "s.connors@cusd.edu",
    "studentCount": 41000,
    "busCount": 300,
    "tier": "PROFESSIONAL",
    "amount": 132000,
    "status": "PENDING",
    "submittedDate": "2024-04-18"
  },
  {
    "id": "Q-102",
    "districtName": "Flagstaff USD",
    "contactName": "Jim Beam",
    "contactRole": "Superintendent",
    "email": "jbeam@fusd.org",
    "studentCount": 9000,
    "busCount": 65,
    "tier": "ENTERPRISE",
    "amount": 49000,
    "status": "REVIEWED",
    "submittedDate": "2024-04-15"
  }
];
export const MOCK_POS: PurchaseOrder[] = [
  {
    "id": "PO-8821",
    "districtName": "Chandler Unified",
    "contactName": "Sarah Connors",
    "email": "s.connors@cusd.edu",
    "fileName": "CUSD_PO_Req_001.pdf",
    "uploadDate": "2024-04-20",
    "status": "PROCESSING"
  },
  {
    "id": "PO-8822",
    "districtName": "Scottsdale Unified",
    "contactName": "Dr. Alan Grant",
    "email": "agrant@susd.org",
    "fileName": "SUSD_PurchaseOrder_FY24.pdf",
    "uploadDate": "2024-04-22",
    "status": "VERIFIED"
  }
];
export const INITIAL_PRICING_CONFIG: PricingConfig = {
  "basePrice": 3000,
  "perBusPrice": 200
};
export const INITIAL_BUDGET_DATA: BudgetEntry[] = [
  {
    "id": "b1",
    "category": "Fuel/Gas",
    "amount": 450000,
    "fiscalYear": 2023,
    "date": "2023-12-31",
    "description": "Annual Diesel & Unleaded"
  },
  {
    "id": "b2",
    "category": "Staff Salaries",
    "amount": 1200000,
    "fiscalYear": 2023,
    "date": "2023-12-31",
    "description": "Drivers & Mechanics"
  },
  {
    "id": "b3",
    "category": "Maintenance",
    "amount": 180000,
    "fiscalYear": 2023,
    "date": "2023-12-31",
    "description": "Parts & Labor"
  },
  {
    "id": "b4",
    "category": "Leases/Purchases",
    "amount": 300000,
    "fiscalYear": 2023,
    "date": "2023-12-31",
    "description": "Fleet Lease Payments"
  },
  {
    "id": "b5",
    "category": "Technology",
    "amount": 25000,
    "fiscalYear": 2023,
    "date": "2023-12-31",
    "description": "Legacy GPS System"
  },
  {
    "id": "b6",
    "category": "Fuel/Gas",
    "amount": 495000,
    "fiscalYear": 2024,
    "date": "2024-06-01",
    "description": "YTD Projected"
  },
  {
    "id": "b7",
    "category": "Staff Salaries",
    "amount": 1250000,
    "fiscalYear": 2024,
    "date": "2024-06-01",
    "description": "YTD Projected"
  },
  {
    "id": "b8",
    "category": "Maintenance",
    "amount": 210000,
    "fiscalYear": 2024,
    "date": "2024-06-01",
    "description": "YTD Projected - Aging Fleet"
  },
  {
    "id": "b9",
    "category": "Leases/Purchases",
    "amount": 300000,
    "fiscalYear": 2024,
    "date": "2024-06-01",
    "description": "Fleet Lease Payments"
  },
  {
    "id": "b10",
    "category": "Technology",
    "amount": 45000,
    "fiscalYear": 2024,
    "date": "2024-06-01",
    "description": "New Tablet Hardware"
  }
];
