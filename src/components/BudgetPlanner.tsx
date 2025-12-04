import React, { useState } from 'react';
import { BudgetEntry, BudgetCategory, FinancialInsight } from '../types';
import { analyzeBudget } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, PieChart as PieIcon, Calculator, Plus, Trash2, Sparkles, RefreshCw, Sliders } from 'lucide-react';

interface BudgetPlannerProps {
  initialData: BudgetEntry[];
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ initialData }) => {
  const [entries, setEntries] = useState<BudgetEntry[]>(initialData);
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'simulator'>('overview');
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  // Ledger Form State
  const [newCategory, setNewCategory] = useState<BudgetCategory>('Fuel/Gas');
  const [newAmount, setNewAmount] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newDesc, setNewDesc] = useState('');

  // Simulator State
  const [efficiencyRate, setEfficiencyRate] = useState(10); // 10% route efficiency improvement
  const [evAdoption, setEvAdoption] = useState(0); // 0% EV fleet
  const [maintenanceOpt, setMaintenanceOpt] = useState(5); // 5% maintenance saving

  // Aggregation Logic
  const years: number[] = Array.from<number>(new Set(entries.map(e => e.fiscalYear))).sort((a, b) => a - b);
  const latestFiscalYear = years.length > 0 ? years[years.length - 1] : new Date().getFullYear();
  
  const getDataByYear = () => {
      return years.map(year => {
          const yearEntries = entries.filter(e => e.fiscalYear === year);
          const total = yearEntries.reduce((sum, e) => sum + e.amount, 0);
          const fuel = yearEntries.filter(e => e.category === 'Fuel/Gas').reduce((sum, e) => sum + e.amount, 0);
          const maint = yearEntries.filter(e => e.category === 'Maintenance').reduce((sum, e) => sum + e.amount, 0);
          return { name: year.toString(), Total: total, Fuel: fuel, Maintenance: maint };
      });
  };

  const getCurrentYearTotal = () => {
      return entries.filter(e => e.fiscalYear === latestFiscalYear).reduce((sum, e) => sum + e.amount, 0);
  };

  const getPreviousYearTotal = () => {
      return entries.filter(e => e.fiscalYear === latestFiscalYear - 1).reduce((sum, e) => sum + e.amount, 0);
  };

  const handleAddEntry = (e: React.FormEvent) => {
      e.preventDefault();
      const newEntry: BudgetEntry = {
          id: `b-${Date.now()}`,
          category: newCategory,
          amount: parseFloat(newAmount),
          fiscalYear: newYear,
          date: new Date().toISOString().split('T')[0],
          description: newDesc || 'Manual Entry'
      };
      setEntries([...entries, newEntry]);
      setNewAmount('');
      setNewDesc('');
  };

  const handleAnalyze = async () => {
      setLoadingAi(true);
      const results = await analyzeBudget(entries);
      setInsights(results);
      setLoadingAi(false);
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];

  // Simulator Calculations
  const currentFuel = entries.filter(e => e.fiscalYear === latestFiscalYear && e.category === 'Fuel/Gas').reduce((sum, e) => sum + e.amount, 0);
  const currentMaint = entries.filter(e => e.fiscalYear === latestFiscalYear && e.category === 'Maintenance').reduce((sum, e) => sum + e.amount, 0);
  
  const fuelSavings = (currentFuel * (efficiencyRate / 100)) + (currentFuel * (evAdoption / 100) * 0.6); // EV reduces fuel cost by ~60% relative to adoption
  const maintSavings = currentMaint * (maintenanceOpt / 100);
  const totalProjectedSavings = fuelSavings + maintSavings;

  return (
    <div className="h-full flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <DollarSign className="text-green-600" /> Budget & Financial Intelligence
                </h2>
                <p className="text-slate-500 mt-1">Upload spend data and use AI to uncover operational efficiencies.</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>Overview</button>
                <button onClick={() => setActiveTab('simulator')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'simulator' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>Efficiency Sandbox</button>
                <button onClick={() => setActiveTab('ledger')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'ledger' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>Expense Ledger</button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-slate-500 text-xs font-bold uppercase mb-2">Current Year Spend</p>
                            <p className="text-3xl font-bold text-slate-800">${getCurrentYearTotal().toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-slate-500 text-xs font-bold uppercase mb-2">YoY Change</p>
                            <div className="flex items-center gap-2">
                                <p className={`text-3xl font-bold ${getCurrentYearTotal() > getPreviousYearTotal() ? 'text-red-500' : 'text-green-500'}`}>
                                    {((getCurrentYearTotal() - getPreviousYearTotal()) / (getPreviousYearTotal() || 1) * 100).toFixed(1)}%
                                </p>
                                {getCurrentYearTotal() > getPreviousYearTotal() ? <TrendingUp size={24} className="text-red-500"/> : <TrendingDown size={24} className="text-green-500"/>}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-blue-100 text-xs font-bold uppercase mb-2">AI Projected Savings</p>
                                <p className="text-3xl font-bold flex items-center gap-2">
                                    <Sparkles size={24} className="text-yellow-400" />
                                    ${Math.round(getCurrentYearTotal() * 0.08).toLocaleString()}
                                </p>
                                <p className="text-xs text-blue-200 mt-1">Potential if route optimization applied</p>
                            </div>
                            <Calculator className="absolute -right-4 -bottom-4 text-white opacity-10 w-32 h-32" />
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
                            <h3 className="font-bold text-slate-800 mb-4">Year over Year Comparison</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getDataByYear()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                    <Legend />
                                    <Bar dataKey="Fuel" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                                    <Bar dataKey="Maintenance" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
                                    <Bar dataKey="Total" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Sparkles className="text-purple-500" size={18} /> AI Financial Analyst
                                </h3>
                                <button 
                                    onClick={handleAnalyze}
                                    disabled={loadingAi}
                                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-200 transition-colors flex items-center gap-1"
                                >
                                    {loadingAi ? <RefreshCw className="animate-spin" size={12}/> : <Sparkles size={12}/>}
                                    Run Analysis
                                </button>
                            </div>
                            
                            <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                                {insights.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400">
                                        <p>Click "Run Analysis" to let Gemini analyze your ledger for savings opportunities.</p>
                                    </div>
                                ) : (
                                    insights.map((insight, i) => (
                                        <div key={i} className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-purple-800 text-sm">{insight.title}</h4>
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                                    Save ${insight.potentialSavings.toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 mb-2">{insight.finding}</p>
                                            <div className="flex items-start gap-2 text-xs bg-white p-2 rounded border border-purple-100">
                                                <TrendingDown className="text-green-500 shrink-0" size={14} />
                                                <span className="text-slate-700"><strong>Strategy:</strong> {insight.recommendation}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'simulator' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    <div className="lg:col-span-1 bg-slate-900 text-white p-6 rounded-xl shadow-xl">
                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                            <Sliders size={20} className="text-blue-400" /> Efficiency Sandbox
                        </h3>
                        <p className="text-slate-400 text-sm mb-8">Adjust operational variables to calculate potential ROI.</p>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-300">Route Efficiency</label>
                                    <span className="text-blue-400 font-mono">{efficiencyRate}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="30" value={efficiencyRate} 
                                    onChange={(e) => setEfficiencyRate(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Reduction in total mileage via AI optimization.</p>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-300">Fleet Electrification</label>
                                    <span className="text-green-400 font-mono">{evAdoption}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="100" value={evAdoption} 
                                    onChange={(e) => setEvAdoption(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Percentage of fleet converted to EV.</p>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-300">Preventative Maint.</label>
                                    <span className="text-orange-400 font-mono">{maintenanceOpt}%</span>
                                </div>
                                <input 
                                    type="range" min="0" max="20" value={maintenanceOpt} 
                                    onChange={(e) => setMaintenanceOpt(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Reduction in major repairs via early detection.</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 font-bold uppercase text-sm">Projected Annual Savings</p>
                                <h2 className="text-5xl font-black text-green-600 mt-2">${Math.round(totalProjectedSavings).toLocaleString()}</h2>
                                <p className="text-slate-400 text-sm mt-1">Based on {latestFiscalYear} spend levels</p>
                            </div>
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <TrendingDown size={32} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 flex-1">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-slate-700 mb-4">Fuel Savings</h4>
                                <p className="text-3xl font-bold text-blue-600">${Math.round(fuelSavings).toLocaleString()}</p>
                                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${currentFuel ? (fuelSavings / currentFuel) * 100 : 0}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">{currentFuel ? (fuelSavings / currentFuel * 100).toFixed(1) : 0}% reduction</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-slate-700 mb-4">Maintenance Savings</h4>
                                <p className="text-3xl font-bold text-orange-500">${Math.round(maintSavings).toLocaleString()}</p>
                                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${currentMaint ? (maintSavings / currentMaint) * 100 : 0}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">{currentMaint ? (maintSavings / currentMaint * 100).toFixed(1) : 0}% reduction</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ledger' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={18} /> Add Expense Entry</h3>
                        <form onSubmit={handleAddEntry} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                                <select value={newCategory} onChange={e => setNewCategory(e.target.value as BudgetCategory)} className="w-full p-2 border border-slate-300 rounded text-sm bg-white">
                                    {['Fuel/Gas', 'Staff Salaries', 'Maintenance', 'Leases/Purchases', 'Insurance', 'Technology', 'Facilities'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Year</label>
                                <input type="number" value={newYear} onChange={e => setNewYear(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded text-sm" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Amount</label>
                                <input type="number" placeholder="0.00" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-full p-2 border border-slate-300 rounded text-sm" required />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                                <input type="text" placeholder="Details..." value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full p-2 border border-slate-300 rounded text-sm" />
                            </div>
                            <div className="md:col-span-1">
                                <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors">Add Entry</button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Year</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700 text-sm">
                                {entries.sort((a,b) => b.fiscalYear - a.fiscalYear).map((entry) => (
                                    <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="p-4 font-mono">{entry.fiscalYear}</td>
                                        <td className="p-4 font-bold"><span className="bg-slate-100 px-2 py-1 rounded">{entry.category}</span></td>
                                        <td className="p-4 text-slate-500">{entry.description}</td>
                                        <td className="p-4 text-right font-mono font-medium">${entry.amount.toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="text-slate-400 hover:text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default BudgetPlanner;
