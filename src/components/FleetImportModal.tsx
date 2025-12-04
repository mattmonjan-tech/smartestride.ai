import React, { useState, useRef } from 'react';
import { BusRoute, BusStatus } from '../types';
import { X, Upload, FileText, Check, AlertCircle, Download, Database } from 'lucide-react';

interface FleetImportModalProps {
  onImport: (newRoutes: BusRoute[]) => void;
  onClose: () => void;
}

const FleetImportModal: React.FC<FleetImportModalProps> = ({ onImport, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        simulateProcess();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          simulateProcess();
      }
  };

  const simulateProcess = () => {
    setIsProcessing(true);
    // Simulate network/parsing delay
    setTimeout(() => {
        // Create dummy imported data with full vehicle details
        const newRoutes: BusRoute[] = [
            {
                id: `R-${Math.floor(Math.random() * 1000) + 500}`,
                name: 'Silverbell Local',
                driver: 'Michael Chang',
                busNumber: 'B-55',
                status: BusStatus.IDLE,
                capacity: 48,
                occupancy: 0,
                nextStop: 'Depot',
                estimatedArrival: '--:--',
                coordinates: { x: 45, y: 45 },
                vehicleType: 'Standard Bus',
                vin: '1HTMMMM123456789',
                licensePlate: 'G-12392',
                make: 'Blue Bird',
                model: 'Vision',
                year: 2018,
                mileage: 45200
            },
            {
                id: `R-${Math.floor(Math.random() * 1000) + 500}`,
                name: 'Houghton Express',
                driver: 'Lisa Ray',
                busNumber: 'B-89',
                status: BusStatus.MAINTENANCE,
                capacity: 60,
                occupancy: 0,
                nextStop: 'Maintenance Yard',
                estimatedArrival: '--:--',
                coordinates: { x: 55, y: 55 },
                vehicleType: 'Standard Bus',
                vin: '4DRSPAL123456789',
                licensePlate: 'G-99281',
                make: 'Thomas Built',
                model: 'Saf-T-Liner C2',
                year: 2020,
                mileage: 22150
            },
            {
                id: `R-${Math.floor(Math.random() * 1000) + 500}`,
                name: 'Unassigned',
                driver: 'TBD',
                busNumber: 'B-90',
                status: BusStatus.IDLE,
                capacity: 14,
                occupancy: 0,
                nextStop: 'Depot',
                estimatedArrival: '--:--',
                coordinates: { x: 60, y: 60 },
                vehicleType: 'Shuttle',
                vin: '1FDXE45678912345',
                licensePlate: 'G-55122',
                make: 'Ford',
                model: 'Transit',
                year: 2023,
                mileage: 1500
            }
        ];
        
        onImport(newRoutes);
        setImportedCount(newRoutes.length);
        setIsProcessing(false);
        setSuccess(true);
        
        // Auto close after success
        setTimeout(onClose, 2000);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    // Enhanced CSV content with Asset Management fields
    const headers = "BusNumber,DriverName,RouteName,Capacity,Status,VehicleType,VIN,LicensePlate,Make,Model,Year,Mileage";
    const rows = [
        "B-101,John Doe,Morning Express,60,On Route,Standard Bus,1HTMMAAN44512,G-44122,Blue Bird,All American,2019,55000",
        "B-102,Jane Smith,North Loop,48,Idle,Shuttle,1FDXE4412331,G-11223,Ford,E-450,2022,12000"
    ];
    const csvContent = [headers, ...rows].join("\n");
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tusd_fleet_asset_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Upload size={18} /> Bulk Fleet Intake
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
            {!success ? (
                <>
                    <div className="text-center mb-6">
                        <p className="text-slate-600 text-sm mb-2">
                            Upload a CSV file containing full vehicle asset details (VIN, Make, Model) and operational data.
                        </p>
                        <button 
                            onClick={handleDownloadTemplate}
                            className="text-blue-600 text-xs font-bold flex items-center justify-center gap-1 hover:underline mx-auto bg-blue-50 px-3 py-1 rounded-full"
                        >
                            <Download size={12} /> Download Comprehensive Template
                        </button>
                    </div>

                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                            isDragging 
                                ? 'border-blue-500 bg-blue-50 scale-105' 
                                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv,.xlsx"
                            onChange={handleFileSelect}
                        />
                        {isProcessing ? (
                            <div className="flex flex-col items-center animate-pulse">
                                <Database size={40} className="text-blue-500 mb-3" />
                                <p className="font-bold text-slate-800">Processing Assets...</p>
                                <p className="text-xs text-slate-400">Validating VINs & Plates...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center group">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                    <Upload size={28} className="text-slate-400 group-hover:text-blue-600" />
                                </div>
                                <p className="font-bold text-slate-700">Click to Browse or Drag CSV</p>
                                <p className="text-xs text-slate-400 mt-1">Supports .csv, .xlsx (Max 5MB)</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3">
                        <Database className="text-blue-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-xs text-blue-800">
                            <strong>Data Sync:</strong> Imported vehicles will automatically populate the Fleet Map and Maintenance Console.
                        </p>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-300">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Intake Successful</h3>
                    <p className="text-slate-500 mt-1">Successfully onboarded <strong>{importedCount}</strong> new vehicles.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FleetImportModal;
