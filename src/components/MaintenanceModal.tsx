
import React from 'react';
import { Wrench, X } from 'lucide-react';

const MaintenanceModal: React.FC<{ isOpen: boolean, onClose: () => void, onSubmit: any, routes: any[] }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-xl w-96">
            <div className="flex justify-between mb-4">
                <h3 className="font-bold flex gap-2"><Wrench/> Report Issue</h3>
                <button onClick={onClose}><X/></button>
            </div>
            <p className="text-sm text-slate-500">Form simulation loaded.</p>
            <button onClick={onClose} className="mt-4 w-full bg-blue-600 text-white py-2 rounded font-bold">Submit Ticket</button>
        </div>
    </div>
  );
};

export default MaintenanceModal;
