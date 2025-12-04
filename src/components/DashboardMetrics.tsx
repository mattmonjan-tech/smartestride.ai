import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BusRoute, Student, StudentStatus } from '../types';

interface DashboardMetricsProps {
  routes: BusRoute[];
  students: Student[];
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ routes, students }) => {
  const activeBuses = routes.filter(r => r.status !== 'Idle' && r.status !== 'Maintenance').length;
  const delayedBuses = routes.filter(r => r.status === 'Delayed').length;
  
  const studentsOnBus = students.filter(s => s.status === StudentStatus.ON_BUS).length;
  const studentsSafe = students.filter(s => s.status === StudentStatus.OFF_BUS).length;

  // Calculate Utilization
  const totalCapacity = routes.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupancy = routes.reduce((acc, r) => acc + r.occupancy, 0);
  const utilizationRate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  const capacityData = routes.map(r => ({
    name: r.busNumber,
    Occupancy: r.occupancy,
    Capacity: r.capacity
  }));

  const statusData = [
    { name: 'On Bus', value: studentsOnBus },
    { name: 'Safe/Arrived', value: studentsSafe },
    { name: 'Absent/Other', value: students.length - studentsOnBus - studentsSafe },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#94a3b8'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Active Fleet</p>
                <p className="text-2xl font-bold text-slate-800">{activeBuses} / {routes.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Delayed</p>
                <p className={`text-2xl font-bold ${delayedBuses > 0 ? 'text-red-500' : 'text-green-500'}`}>{delayedBuses}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Students In Transit</p>
                <p className="text-2xl font-bold text-blue-600">{studentsOnBus}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-slate-500 text-sm font-medium">Fleet Utilization</p>
                    <div className="flex items-end gap-2 mt-1">
                        <p className={`text-2xl font-bold ${utilizationRate > 90 ? 'text-red-500' : 'text-slate-800'}`}>{utilizationRate}%</p>
                        <p className="text-xs text-slate-400 mb-1.5">of {totalCapacity} seats</p>
                    </div>
                </div>
                {/* Subtle visual progress bar background */}
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${utilizationRate}%` }} 
                />
            </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Occupancy vs. Capacity</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                    <Bar dataKey="Capacity" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total Capacity" />
                    <Bar dataKey="Occupancy" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Current Riders" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Status Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-slate-700">
                        {students.length}
                    </text>
                    <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-medium fill-slate-400">
                        Total Students
                    </text>
                </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-xs text-slate-500">
                {statusData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                        {d.name}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default DashboardMetrics;
