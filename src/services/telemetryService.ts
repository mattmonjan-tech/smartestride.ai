
import { TelemetryData } from '../types';

// Constants for simulation
const BASE_SPEED = 35;
const IDLE_RPM = 700;
const DRIVE_RPM = 2200;

export const generateTelemetryPacket = (busId: string, isMoving: boolean): TelemetryData => {
    const speed = isMoving ? BASE_SPEED + (Math.random() * 10 - 5) : 0;
    const rpm = isMoving ? DRIVE_RPM + (Math.random() * 200 - 100) : IDLE_RPM + (Math.random() * 50 - 25);
    
    return {
        busId,
        speed: Math.max(0, Math.round(speed)),
        rpm: Math.round(rpm),
        fuelLevel: Math.max(0, 100 - (Math.random() * 5)), // Slowly decreasing
        odometer: 45000 + Math.floor(Math.random() * 100),
        engineTemp: 195 + (Math.random() * 10 - 5),
        timestamp: new Date().toISOString(),
        faultCodes: Math.random() > 0.95 ? ['P0420'] : [] // Occasional fault code
    };
};

export const diagnoseFaultCode = (code: string): string => {
    const codes: Record<string, string> = {
        'P0420': 'Catalytic Converter Efficiency Below Threshold',
        'P0300': 'Random/Multiple Cylinder Misfire Detected',
        'P0128': 'Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)',
        'P0171': 'System Too Lean (Bank 1)'
    };
    return codes[code] || 'Unknown DTC';
};
