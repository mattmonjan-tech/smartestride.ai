import React, { useState } from 'react';
import { X, Printer, Zap, Tablet, Server, Wifi, Globe, Download, Loader2, Trash2, Rocket, Cable, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { getProjectFiles } from '../services/missionControlExport';

interface MissionControlProps {
  onClose: () => void;
  initialTab?: 'SMART' | 'DUMB' | 'CLOUD' | 'LIVE';
}

const MissionControl: React.FC<MissionControlProps> = ({ onClose, initialTab = 'SMART' }) => {
  const [activeTab, setActiveTab] = useState<'SMART' | 'DUMB' | 'CLOUD' | 'LIVE'>(initialTab);
  const [isZipping, setIsZipping] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSource = async () => {
      setIsZipping(true);
      try {
          const zip = new JSZip();
          const staticFiles = getProjectFiles(); 

          // Add Files
          Object.entries(staticFiles).forEach(([name, content]) => {
              zip.file(name, content);
          });

          // Generate ZIP
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, "ridesmart-v24-final-release.zip");
      } catch (e) {
          console.error("Zip failed", e);
          alert("Could not generate ZIP. Please check console.");
      } finally {
          setIsZipping(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 font-poppins overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-700">
        
        {/* Header */}
        <div className="bg-black text-white p-8 flex justify-between items-start shrink-0 print:hidden border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-600 p-2 rounded-lg animate-pulse">
                    <CheckCircle2 size={28} fill="currentColor" />
                </div>
                <h1 className="text-4xl font-black tracking-tight uppercase">Mission Control</h1>
            </div>
            <p className="text-slate-400 font-mono text-sm">Deployment Sequence Initiated • v24.0.0 (PURPLE PROTOCOL)</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
             >
                <Printer size={18} /> Print Manual
             </button>
             <button 
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
             >
                <X size={24} />
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 print:hidden overflow-x-auto">
            <button 
                onClick={() => setActiveTab('SMART')}
                className={`flex-1 py-5 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-4 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'SMART' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Wifi size={18} /> Phase 1: Hardware
            </button>
            <button 
                onClick={() => setActiveTab('DUMB')}
                className={`flex-1 py-5 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-4 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'DUMB' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Tablet size={18} /> Phase 2: Legacy
            </button>
            <button 
                onClick={() => setActiveTab('CLOUD')}
                className={`flex-1 py-5 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-4 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'CLOUD' ? 'border-purple-600 text-purple-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Server size={18} /> Phase 3: Config
            </button>
            <button 
                onClick={() => setActiveTab('LIVE')}
                className={`flex-1 py-5 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-4 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'LIVE' ? 'border-purple-600 text-purple-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Globe size={18} /> Phase 4: Deploy
            </button>
        </div>

        {/* Content Area */}
        <div className="p-10 overflow-y-auto custom-scrollbar bg-white print:p-0 print:overflow-visible">
            
            {/* ---------------- SMART BUS GUIDE ---------------- */}
            {(activeTab === 'SMART' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                <div className="space-y-8 print:block">
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            Smart Bus Installation
                        </h2>
                        <p className="text-slate-600">
                            For vehicles model year 2015+ or equipped with J1939/OBD-II diagnostic ports.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Required Hardware</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <Zap className="text-blue-600 shrink-0" />
                                    <div>
                                        <span className="font-bold text-slate-800 block">Telematics Dongle</span>
                                        <span className="text-sm text-slate-500">Geotab GO9, Samsara VG54, or RideSmart Connect</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <Cable className="text-blue-600 shrink-0" />
                                    <div>
                                        <span className="font-bold text-slate-800 block">Harness Adapter</span>
                                        <span className="text-sm text-slate-500">9-Pin J1939 (Green) or 16-Pin OBD-II (Black)</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- DUMB BUS GUIDE ---------------- */}
            {(activeTab === 'DUMB' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                <div className="space-y-8 pt-8 border-t border-slate-200 print:border-0 print:pt-0 print:mt-8">
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            Legacy Bus Installation
                        </h2>
                        <p className="text-slate-600">
                            For older vehicles without digital capabilities. 
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                            <Tablet size={48} className="mx-auto mb-4 text-slate-400" />
                            <h3 className="font-bold text-slate-800">1. Tablet Setup</h3>
                            <p className="text-sm text-slate-500 mt-2">Provision an iPad (iOS 15+) or Samsung Tab A8.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                            <ShieldCheck size={48} className="mx-auto mb-4 text-slate-400" />
                            <h3 className="font-bold text-slate-800">2. Physical Mount</h3>
                            <p className="text-sm text-slate-500 mt-2">Use a heavy-duty RAM Mount to secure tablet.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                            <Smartphone size={48} className="mx-auto mb-4 text-slate-400" />
                            <h3 className="font-bold text-slate-800">3. Kiosk Mode</h3>
                            <p className="text-sm text-slate-500 mt-2">Enable "Guided Access" (iOS) or "Pin App" (Android).</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- CLOUD GUIDE ---------------- */}
             {(activeTab === 'CLOUD' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                <div className="space-y-8 pt-8 border-t border-slate-200 print:border-0 print:pt-0 print:mt-8">
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            IT & Cloud Configuration
                        </h2>
                        <p className="text-slate-600">
                            Technical requirements for the Network Administrator.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                            <div>
                                <p className="font-bold text-slate-800">Firewall Whitelist</p>
                                <p className="text-sm text-slate-500">Allow outbound traffic on ports 80/443 and 8883 (MQTT).</p>
                            </div>
                            <code className="bg-slate-100 px-3 py-1 rounded text-sm font-mono">*.ridesmart.ai</code>
                        </div>
                    </div>
                </div>
             )}

             {/* ---------------- GOING LIVE GUIDE ---------------- */}
             {activeTab === 'LIVE' && (
                <div className="space-y-8">
                     <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            Launch Sequence
                        </h2>
                        <p className="text-slate-600">
                            Prepare the application for production deployment on Vercel.
                        </p>
                    </div>
                    
                    <div className="bg-purple-50 border-2 border-purple-200 p-8 rounded-xl shadow-lg">
                         <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2 text-xl">
                            <Download size={24} /> Export Production Code
                        </h3>
                        <p className="text-sm text-purple-700 mb-6">
                            This package contains the final, verified source code with all necessary patches for Vercel (including package.json fixes and vercel.json overrides).
                        </p>
                        
                        <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500 shadow-sm mb-6">
                            <p className="text-sm text-purple-600 font-bold flex items-center gap-2 mb-1">
                                <Trash2 size={16}/> CRITICAL INSTRUCTION
                            </p>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                Before uploading this zip file to GitHub, you <strong>MUST DELETE ALL EXISTING FILES</strong> in your repository. Starting fresh ensures no old configuration files conflict with the new build.
                            </p>
                        </div>
                        
                        <button 
                            onClick={handleDownloadSource}
                            disabled={isZipping}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-purple-600/20 flex items-center justify-center gap-3 transition-all text-lg"
                        >
                            {isZipping ? (
                                <><Loader2 size={24} className="animate-spin"/> Compiling Assets...</>
                            ) : (
                                <><Rocket size={24} /> Download Source Code (v24 - FINAL RELEASE)</>
                            )}
                        </button>
                    </div>
                </div>
             )}

        </div>
      </div>
    </div>
  );
};

export default MissionControl;
