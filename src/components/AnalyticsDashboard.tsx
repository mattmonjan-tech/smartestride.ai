
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BusRoute } from '../types';
import { TrendingUp, DollarSign, Leaf, Activity } from 'lucide-react';

interface AnalyticsDashboardProps {
    routes?: BusRoute[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ routes }) => {
    // Mock Data for Charts
    const savingsData = [
        { month: 'Jan', Savings: 4000 },
        { month: 'Feb', Savings: 3000 },
        { month: 'Mar', Savings: 2000 },
        { month: 'Apr', Savings: 2780 },
        { month: 'May', Savings: 1890 },
        { month: 'Jun', Savings: 2390 },
    ];

    const efficiencyData = [
        { month: 'Jan', Efficiency: 65 },
        { month: 'Feb', Efficiency: 70 },
        { month: 'Mar', Efficiency: 75 },
        { month: 'Apr', Efficiency: 82 },
        { month: 'May', Efficiency: 88 },
        { month: 'Jun', Efficiency: 92 },
    ];

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-blue-600" /> Operational Analytics
                </h2>
                <p className="text-slate-500 mt-1">Real-time ROI and fleet efficiency metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Savings (YTD)</p>
                    <p className="text-3xl font-bold text-green-600 flex items-center gap-2">
                        <DollarSign size={24} /> 16,060
                    </p>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                        <TrendingUp size={12} /> +12% vs last year
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Carbon Reduction</p>
                    <p className="text-3xl font-bold text-teal-600 flex items-center gap-2">
                        <Leaf size={24} /> 4.2 Tons
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                        CO2 emissions prevented
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Efficiency Score</p>
                    <p className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
                        92/100
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                        Based on route optimization
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4">Monthly Cost Savings</h3>
                    <div className="flex-1 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={savingsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                                <Tooltip cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="Savings" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4">Fleet Efficiency Trend</h3>
                    <div className="flex-1 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={efficiencyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip />
                                <Area type="monotone" dataKey="Efficiency" stroke="#6366f1" fill="#e0e7ff" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
