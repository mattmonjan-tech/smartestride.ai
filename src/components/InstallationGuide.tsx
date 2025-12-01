
import React, { useState } from 'react';
import { X, Printer, Zap, Tablet, Server, CheckCircle2, AlertTriangle, Wifi, Smartphone, Cable, ShieldCheck, Code, Globe, Download, Loader2, Trash2 } from 'lucide-react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { getProjectFiles } from '../services/rescueExport';

interface InstallationGuideProps {
  onClose: () => void;
  initialTab?: 'SMART' | 'DUMB' | 'CLOUD' | 'LIVE';
}

const InstallationGuide: React.FC<InstallationGuideProps> = ({ onClose, initialTab = 'SMART' }) => {
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
          saveAs(content, "ridesmart-source-v45.zip");
      } catch (e) {
          console.error("Zip failed", e);
          alert("Could not generate ZIP. Please check console.");
      } finally {
          setIsZipping(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 font-poppins overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 flex justify-between items-start shrink-0 print:hidden">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Zap size={24} fill="currentColor" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">RideSmart Deployment Manual</h1>
            </div>
            <p className="text-slate-400">Official installation procedures for Fleet Operations & IT Teams.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
             >
                <Printer size={18} /> Print Guide
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
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-4 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'SMART' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Wifi size={18} /> Smart Bus
            </button>
            <button 
                onClick={() => setActiveTab('DUMB')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-4 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'DUMB' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Tablet size={18} /> Legacy Bus
            </button>
            <button 
                onClick={() => setActiveTab('CLOUD')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-4 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'CLOUD' ? 'border-purple-600 text-purple-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Server size={18} /> IT Config
            </button>
            <button 
                onClick={() => setActiveTab('LIVE')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-4 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'LIVE' ? 'border-green-600 text-green-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                <Globe size={18} /> Going Live
            </button>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-white print:p-0 print:overflow-visible">
            
            {/* ---------------- SMART BUS GUIDE ---------------- */}
            {(activeTab === 'SMART' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                <div className="space-y-8 print:block">
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">A</span>
                            Scenario: Smart Bus Installation
                        </h2>
                        <p className="text-slate-600">
                            For vehicles model year 2015+ or equipped with J1939/OBD-II diagnostic ports.
                            This method requires <strong>zero driver interaction</strong> for data collection.
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

                        <div className="space-y-6">
                             <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Installation Steps</h3>
                             <div className="space-y-4">
                                 <div className="flex gap-4">
                                     <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                                     <div>
                                         <h4 className="font-bold text-slate-900">Locate Diagnostic Port</h4>
                                         <p className="text-sm text-slate-600 mt-1">Usually located under the dashboard on the driver's left side, or in the kick panel.</p>
                                     </div>
                                 </div>
                                 <div className="flex gap-4">
                                     <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                                     <div>
                                         <h4 className="font-bold text-slate-900">Connect Harness & Dongle</h4>
                                         <p className="text-sm text-slate-600 mt-1">Plug the harness into the port, then secure the dongle high in the dashboard (zip-tie) for best GPS signal.</p>
                                     </div>
                                 </div>
                                 <div className="flex gap-4">
                                     <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                                     <div>
                                         <h4 className="font-bold text-slate-900">Ignition Cycle</h4>
                                         <p className="text-sm text-slate-600 mt-1">Turn bus engine ON. Wait for 3 solid LED lights (Power, GPS, Cellular) on the dongle.</p>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- DUMB BUS GUIDE ---------------- */}
            {(activeTab === 'DUMB' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                <div className="space-y-8 pt-8 border-t border-slate-200 print:border-0 print:pt-0 print:mt-8">
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <span className="bg-orange-100 text-orange-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">B</span>
                            Scenario: Legacy Bus Installation
                        </h2>
                        <p className="text-slate-600">
                            For older vehicles without digital capabilities. This transforms the bus into a "Smart" vehicle using a mounted tablet running the <strong>RideSmart Driver App</strong>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                            <Tablet size={48} className="mx-auto mb-4 text-slate-400" />
                            <h3 className="font-bold text-slate-800">1. Tablet Setup</h3>
                            <p className="text-sm text-slate-500 mt-2">Provision an iPad (iOS 15+) or Samsung Tab A8. Install "RideSmart Driver" from the MDM store.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                            <ShieldCheck size={48} className="mx-auto mb-4 text-slate-400" />
                            <h3 className="font-bold text-slate-800">2. Physical Mount</h3>
                            <p className="text-sm text-slate-500 mt-2">Use a heavy-duty RAM Mount to secure tablet to the right of the steering wheel. Ensure power is hardwired.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                            <Smartphone size={48} className="mx-auto mb-4 text-slate-400" />
                            <h3 className="font-bold text-slate-800">3. Kiosk Mode</h3>
                            <p className="text-sm text-slate-500 mt-2">Enable "Guided Access" (iOS) or "Pin App" (Android) to prevent drivers from exiting the application.</p>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl flex gap-4">
                        <AlertTriangle className="text-orange-500 shrink-0" size={24} />
                        <div>
                            <h4 className="font-bold text-orange-800">Driver Workflow Training Required</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                Unlike Smart Buses, this method requires the driver to manually hit "Start Route" and "End Route". 
                                Drivers must also manually enter the Odometer reading during the pre-trip inspection screen.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- CLOUD GUIDE ---------------- */}
             {(activeTab === 'CLOUD' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                <div className="space-y-8 pt-8 border-t border-slate-200 print:border-0 print:pt-0 print:mt-8">
                    <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <span className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">C</span>
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
                         <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                            <div>
                                <p className="font-bold text-slate-800">MDM Configuration</p>
                                <p className="text-sm text-slate-500">Push App Configuration Key for auto-login.</p>
                            </div>
                            <code className="bg-slate-100 px-3 py-1 rounded text-sm font-mono">dist_id=TUSD_882</code>
                        </div>
                    </div>
                </div>
             )}

             {/* ---------------- GOING LIVE GUIDE ---------------- */}
             {activeTab === 'LIVE' && (
                <div className="space-y-8">
                     <div className="border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                            <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">D</span>
                            Production Launch Guide
                        </h2>
                        <p className="text-slate-600">
                            How to move this application from "Chat Mode" to a permanently hosted URL that you can share with investors.
                        </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-100 p-6 rounded-xl shadow-sm">
                         <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                            <Download size={20} /> Download Source Code
                        </h3>
                        <p className="text-sm text-green-700 mb-4">
                            Get a ZIP file containing the project structure (package.json, tsconfig, etc.) ready for GitHub upload.
                        </p>
                        
                        <div className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-md mb-4">
                            <p className="text-sm text-red-600 font-bold flex items-center gap-2 mb-1">
                                <Trash2 size={16}/> ACTION REQUIRED: Delete Lock File
                            </p>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                You must go to your GitHub repository and <strong>DELETE <code>package-lock.json</code></strong> before uploading this new code. 
                                <br/>If you skip this, the error will persist forever.
                            </p>
                        </div>
                        
                        <button 
                            onClick={handleDownloadSource}
                            disabled={isZipping}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-green-600/20 flex items-center gap-2 transition-all"
                        >
                            {isZipping ? (
                                <><Loader2 size={18} className="animate-spin"/> Packaging Files...</>
                            ) : (
                                <><Download size={18} /> Download Source (v13 - NUCLEAR CACHE CLEAR)</>
                            )}
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white p-6 rounded-xl">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Code className="text-blue-400" /> The "Vibe Coding" Workflow
                            </h3>
                            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                                You don't need to be a developer to maintain this app. Follow this cycle to keep updating the app using AI:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                <div className="bg-white/10 p-4 rounded-lg">
                                    <div className="font-bold text-blue-400 mb-1">1. Ask AI</div>
                                    <div className="text-xs text-slate-400">"Change button to red"</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg">
                                    <div className="font-bold text-purple-400 mb-1">2. Copy Code</div>
                                    <div className="text-xs text-slate-400">Get XML/Code block</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg">
                                    <div className="font-bold text-green-400 mb-1">3. Update GitHub</div>
                                    <div className="text-xs text-slate-400">Paste into file</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg">
                                    <div className="font-bold text-white mb-1">4. Live!</div>
                                    <div className="text-xs text-slate-400">Vercel auto-deploys</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             )}

        </div>
      </div>
    </div>
  );
};

export default InstallationGuide;
