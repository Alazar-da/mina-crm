'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Download, Filter, Loader2, TrendingUp, Users, Target, CheckCircle } from 'lucide-react';
import {cn} from '@/lib/utils';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const performanceData = [
    { name: 'Jan', sales: 4000, leads: 2400 },
    { name: 'Feb', sales: 3000, leads: 1398 },
    { name: 'Mar', sales: 2000, leads: 9800 },
    { name: 'Apr', sales: 2780, leads: 3908 },
    { name: 'May', sales: 1890, leads: 4800 },
    { name: 'Jun', sales: 2390, leads: 3800 },
  ];

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Deep dive into Mina Technologies performance metrics.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Sales vs Leads Comparison</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Monthly Revenue Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Conversion Rate', val: '24.5%', icon: Target, color: 'text-blue-600' },
          { title: 'Avg Deal Size', val: '$12,400', icon: TrendingUp, color: 'text-emerald-600' },
          { title: 'Customer Retention', val: '92%', icon: Users, color: 'text-violet-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl bg-slate-50", item.color)}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{item.title}</p>
              <h4 className="text-xl font-bold text-slate-900">{item.val}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
