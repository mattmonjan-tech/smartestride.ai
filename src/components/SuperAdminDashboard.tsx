import React, { useState, useEffect } from 'react';
import { MOCK_TENANTS, MOCK_INVOICES, INITIAL_ROUTES, INITIAL_STUDENTS, INITIAL_TICKETS } from '../constants';
import { QuoteRequest, SystemSettings } from '../types';
import { LayoutDashboard, Globe, DollarSign, Users, Server, FileText, Check, ArrowRight, Bell, GitBranch, Database, Cloud, Save, Key, Link, Loader2, AlertCircle, UploadCloud, RefreshCw, Search, LifeBuoy } from 'lucide-react';
import YearlyReport from './YearlyReport';
import TelematicsIntegration from './TelematicsIntegration';
import RescueDeploy from './RescueDeploy';
import SupabaseWizard from './SupabaseWizard';
import { testConnection, seedDatabase, verifyData, initSupabase, getSupabase } from '../services/supabaseService';

interface SuperAdminDashboardProps {
  onImpersonate: (tenantId: string) => void;
  quotes: QuoteRequest[];
  systemSettings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onImpersonate, quotes, systemSettings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'quotes' | 'infrastructure'>('overview');
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showMissionControl, setShowMissionControl] = useState(false);
  const [showDbWizard, setShowDbWizard] = useState(false);

  const [supabaseForm, setSupabaseForm] = useState({
      url: systemSettings.supabaseUrl || '',
      key: systemSettings.supabaseKey || ''
  });
  
  useEffect(() => {
      if (systemSettings.supabaseUrl || systemSettings.supabaseKey) {
          setSupabaseForm({
              url: systemSettings.supabaseUrl || '',
              key: systemSettings.supabaseKey || ''
          });
          initSupabase(systemSettings.supabaseUrl || '', systemSettings.supabaseKey || '');
      }
  }, [systemSettings]);

  const [connectionStatus, setConnectionStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{success: boolean, message: string} | null>(null);
  const [cloudCounts, setCloudCounts] = useState<{students: number, buses: number} | null>(null);

  const handleSaveSettings = async () => {
      const trimmedUrl = supabaseForm.url.trim();
      const trimmedKey = supabaseForm.key.trim();

      setSupabaseForm({ url: trimmedUrl, key: trimmedKey }); 
      setConnectionStatus('TESTING');
      setStatusMessage('Verifying credentials...');
      
      const result = await testConnection(trimmedUrl, trimmedKey);
      
      if (result.success) {
          setConnectionStatus('SUCCESS');
          setStatusMessage(result.message);
          initSupabase(trimmedUrl, trimmedKey);
          
          onUpdateSettings({
              ...systemSettings,
              supabaseUrl: trimmedUrl,
              supabaseKey: trimmedKey
          });
          setTimeout(() => {
             setConnectionStatus('IDLE');
             setStatusMessage('');
          }, 5000);
      } else {
          setConnectionStatus('ERROR');
          setStatusMessage(result.message);
      }
  };

  const handleSeedDatabase = async () => {
      setIsSeeding(true);
      setSeedResult(null);

      try {
          const activeUrl = systemSettings.supabaseUrl || supabaseForm.url.trim();
          const activeKey = systemSettings.supabaseKey || supabaseForm.key.trim();

          if (!activeUrl || !activeKey) {
              setIsSeeding(false);
              alert("Configuration Missing: Please enter your Supabase Project URL and Key.");
              return;
          }

          const client = initSupabase(activeUrl, activeKey);
          if (!client) {
              setIsSeeding(false);
              setSeedResult({ success: false, message: "Could not initialize Supabase client." });
              return;
          }

          const result = await seedDatabase('TUSD-882', INITIAL_ROUTES, INITIAL_STUDENTS, INITIAL_TICKETS);
          setSeedResult(result);
          if (result.success) {
              alert("Seeding Successful!");
              handleVerifyData();
          } else {
              alert(`Error: ${result.message}`);
          }
      } catch (e: any) {
          setSeedResult({ success: false, message: `Error: ${e.message}` });
      } finally {
          setIsSeeding(false);
      }
  };

  const handleVerifyData = async () => {
      const activeUrl = systemSettings.supabaseUrl || supabaseForm.url.trim();
      const activeKey = systemSettings.supabaseKey || supabaseForm.key.trim();
      if (!activeUrl || !activeKey) {
          alert("Please enter your Supabase URL and Key.");
          return;
      }
      if (!getSupabase() && activeUrl && activeKey) {
          initSupabase(activeUrl, activeKey);
      }
      const counts = await verifyData();
      if (counts.success) {
          setCloudCounts({ students: counts.students, buses: counts.buses });
      } else {
          alert("Verification failed.");
      }
  };

  const totalRevenue = MOCK_INVOICES.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const activeTenants = MOCK_TENANTS.filter(t => t.status === 'ACTIVE').length;
  const totalStudents = MOCK_TENANTS.reduce((acc, t) => acc + t.studentCount, 0);
  const hasConfig = !!(systemSettings.supabaseUrl && systemSettings.supabaseKey) || (supabaseForm.url.length > 10 && supabaseForm.key.length > 10);

  if (showReportGenerator) {
      return (
          <div className="h-full flex flex-col">
              <div className="p-6 border-b border-slate-800 bg-slate-900 text-white flex justify-between items-center">
                  <h2 className="text-xl font-bold">Yearly Report Generator</h2>
                  <button onClick={() => setShowReportGenerator(false)} className="px-4 py-2 bg-slate-800 rounded hover:bg-slate-700 text-sm">Back to Dashboard</button>
              </div>
              <div className="flex-1 p-6 bg-slate-900 overflow-y-auto">
                  <YearlyReport tenantName="Tucson Unified School District" />
              </div>
          </div>
      )
  }

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex font-sans">
      {showMissionControl && <RescueDeploy onClose={() => setShowMissionControl(false)} />}
      {showDbWizard && <SupabaseWizard onClose={() => setShowDbWizard(false)} />}

      <aside className="w-64 bg-black border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-amber-500 mb-1"><LayoutDashboard size={24} /><span className="font-bold tracking-wider text-lg">CONTROLLER</span></div>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Master Admin View</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
           <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-white/5'}`}><Globe size={20} /> <span className="font-medium">Global Overview</span></button>
           <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'finance' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-white/5'}`}><DollarSign size={20} /> <span className="font-medium">Financials</span></button>
           <button onClick={() => setActiveTab('quotes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'quotes' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-white/5'}`}><FileText size={20} /> <span className="font-medium">Quotes & POs</span></button>
           <div className="pt-4 mt-4 border-t border-slate-800">
             <p className="text-[10px] uppercase text-slate-600 font-bold px-4 mb-2">System</p>
             <button onClick={() => setActiveTab('infrastructure')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'infrastructure' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-white/5'}`}><Server size={20} /> <span className="font-medium">Infrastructure</span></button>
             <button onClick={() => setShowMissionControl(true)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white font-bold group`}><LifeBuoy size={20} className="group-hover:animate-pulse" /> <span className="font-medium">OPEN RESCUE PROTOCOL</span></button>
           </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900">
        <header className="p-8 pb-0 flex justify-between items-end">
            <div><h1 className="text-3xl font-bold text-white mb-2">{activeTab === 'overview' ? 'Network Command Center' : activeTab === 'finance' ? 'Revenue & Invoicing' : activeTab === 'quotes' ? 'Sales Pipeline' : 'Cloud Infrastructure'}</h1><p className="text-slate-400">Welcome back, <span className="text-white font-bold">Matt Monjan</span>. System status: <span className="text-green-500 font-bold">OPERATIONAL</span></p></div>
            <div className="flex items-center gap-4"><div className="relative"><Bell className="text-slate-400 hover:text-white cursor-pointer" /><span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span></div></div>
        </header>

        <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700"><p className="text-slate-400 text-sm font-medium uppercase mb-2">Total Revenue (YTD)</p><p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p></div>
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700"><p className="text-slate-400 text-sm font-medium uppercase mb-2">Active Districts</p><p className="text-3xl font-bold text-amber-500">{activeTenants}</p></div>
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700"><p className="text-slate-400 text-sm font-medium uppercase mb-2">Students Protected</p><p className="text-3xl font-bold text-blue-400">{totalStudents.toLocaleString()}</p></div>
                 <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden"><p className="text-slate-400 text-sm font-medium uppercase mb-2">Database Health</p><p className="text-xl font-bold text-green-400 flex items-center gap-2"><Check size={20}/> Healthy</p></div>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Active Tenant Directory</h3>
                    <div className="grid gap-4">
                        {MOCK_TENANTS.map(tenant => (
                            <div key={tenant.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center justify-between group hover:border-slate-600 transition-colors">
                                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 font-bold text-lg">{tenant.name.substring(0, 2).toUpperCase()}</div><div><h4 className="font-bold text-lg text-white">{tenant.name}</h4><div className="flex gap-4 text-sm text-slate-400 mt-1"><span className="flex items-center gap-1"><Users size={14}/> {tenant.studentCount.toLocaleString()} Students</span></div></div></div>
                                <div className="flex items-center gap-4"><button onClick={() => onImpersonate(tenant.id)} className="px-4 py-2 bg-white text-slate-900 font-bold rounded hover:bg-slate-200 transition-colors flex items-center gap-2">Access Dashboard <ArrowRight size={16}/></button></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'infrastructure' && (
                <div className="space-y-8">
                     <div className="mb-8"><TelematicsIntegration settings={systemSettings} onUpdateSettings={onUpdateSettings} /></div>
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-start mb-6">
                            <div><h3 className="text-xl font-bold text-white flex items-center gap-2"><GitBranch className="text-amber-500" /> Cloud Environment</h3></div>
                            <div className={`px-3 py-1 text-xs font-bold rounded border uppercase ${connectionStatus === 'SUCCESS' ? 'bg-green-900/50 text-green-400' : 'bg-blue-900/50 text-blue-400'}`}>Environment: {connectionStatus === 'SUCCESS' ? 'PRODUCTION' : 'DEMO (LOCAL)'}</div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             <div className="bg-black/30 p-6 rounded-xl border border-slate-700 flex flex-col">
                                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center"><Cloud size={20} className="text-white" /></div><div><h4 className="font-bold text-white">Frontend Hosting</h4><p className="text-xs text-slate-400">Vercel / Netlify</p></div><span className="ml-auto text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-800">Live</span></div>
                                <div className="mt-auto"><button onClick={() => setShowMissionControl(true)} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-blue-400 group"><LifeBuoy size={18} className="group-hover:animate-pulse" /> OPEN RESCUE PROTOCOL (v45)</button></div>
                             </div>

                             <div className="bg-black/30 p-6 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center"><Database size={20} className="text-green-500" /></div><div><h4 className="font-bold text-white">Production Database</h4><p className="text-xs text-slate-400">Supabase (Postgres)</p></div><button onClick={() => setShowDbWizard(true)} className="ml-auto text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded font-bold transition-colors">Launch Wizard</button></div>
                                <div className="space-y-4 mb-4">
                                    <div><label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Link size={10}/> Project URL</label><input type="text" value={supabaseForm.url} onChange={(e) => setSupabaseForm({...supabaseForm, url: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-green-500 outline-none font-mono"/></div>
                                    <div><label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Key size={10}/> Anon Key</label><input type="password" value={supabaseForm.key} onChange={(e) => setSupabaseForm({...supabaseForm, key: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-green-500 outline-none font-mono"/></div>
                                </div>
                                {statusMessage && (<div className={`mb-4 p-2 rounded text-xs flex items-center gap-2 ${connectionStatus === 'SUCCESS' ? 'bg-green-900/30 text-green-400 border border-green-800' : connectionStatus === 'ERROR' ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-blue-900/30 text-blue-400'}`}>{statusMessage}</div>)}
                                <button onClick={handleSaveSettings} disabled={connectionStatus === 'TESTING'} className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold rounded flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20">{connectionStatus === 'TESTING' ? 'Connecting...' : <><Save size={16} /> Save Connection & Sync</>}</button>
                             </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><RefreshCw className="text-purple-500" size={20} /> Cloud Data Sync</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-black/20 p-4 rounded-lg border border-slate-700"><h4 className="font-bold text-white mb-2 flex items-center gap-2"><UploadCloud size={16} /> Seed Database</h4><button onClick={handleSeedDatabase} disabled={isSeeding || !hasConfig} className={`w-full py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors ${isSeeding ? 'bg-purple-900 text-purple-200 cursor-wait' : hasConfig ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-700 text-slate-500'}`}>{isSeeding ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : 'Push Local Data to Cloud'}</button>{seedResult && (<div className={`mt-3 p-2 rounded text-xs ${seedResult.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{seedResult.message}</div>)}</div>
                            <div className="bg-black/20 p-4 rounded-lg border border-slate-700"><h4 className="font-bold text-white mb-2 flex items-center gap-2"><Search size={16} /> Verify Cloud Data</h4><div className="flex gap-3"><button onClick={handleVerifyData} disabled={!hasConfig} className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${hasConfig ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}>{hasConfig ? 'Check Counts' : 'Enter Config Above'}</button></div>{cloudCounts && (<div className="mt-3 grid grid-cols-2 gap-2 animate-in fade-in"><div className="bg-slate-900 p-2 rounded text-center"><p className="text-xs text-slate-500 uppercase">Buses</p><p className="text-lg font-bold text-blue-400">{cloudCounts.buses}</p></div><div className="bg-slate-900 p-2 rounded text-center"><p className="text-xs text-slate-500 uppercase">Students</p><p className="text-lg font-bold text-green-400">{cloudCounts.students}</p></div></div>)}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
