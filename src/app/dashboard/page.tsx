'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart, StatusDistribution } from '@/components/dashboard/Charts';
/* import { getDashboardStats } from '@/actions/reportActions'; */
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

/*   useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []); */

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Customers" 
          value={stats.totalCustomers} 
          change="12%" 
          isPositive={true} 
          icon={Users} 
          color="bg-blue-50 text-blue-600" 
        />
        <KPICard 
          title="New Leads" 
          value={stats.newLeads} 
          change="8%" 
          isPositive={true} 
          icon={Target} 
          color="bg-indigo-50 text-indigo-600" 
        />
        <KPICard 
          title="Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          change="24%" 
          isPositive={true} 
          icon={DollarSign} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <KPICard 
          title="Open Tickets" 
          value={stats.openTickets} 
          change="5" 
          isPositive={false} 
          icon={AlertCircle} 
          color="bg-red-50 text-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Revenue Trend</h2>
            <select className="bg-slate-50 border-none text-sm font-medium text-slate-500 rounded-lg p-1 px-2 focus:ring-0">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <RevenueChart />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Customer Status</h2>
          <StatusDistribution />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Follow-up completed with TechCorp</p>
                  <p className="text-xs text-slate-500 mt-0.5">by Sarah Jenkins • 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Follow-ups</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline">View Calendar</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Future Soft', type: 'Site Visit', time: 'Tomorrow, 10:00 AM', priority: 'High' },
              { name: 'Global Industries', type: 'Proposal Review', time: 'June 6, 2:30 PM', priority: 'Medium' },
              { name: 'Data Stream', type: 'Initial Call', time: 'June 7, 11:15 AM', priority: 'Low' },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-10 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{task.name}</p>
                    <p className="text-xs text-slate-500">{task.type} • {task.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className={cn(
                     "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded",
                     task.priority === 'High' ? "bg-red-100 text-red-600" : 
                     task.priority === 'Medium' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                   )}>
                     {task.priority}
                   </span>
                   <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
