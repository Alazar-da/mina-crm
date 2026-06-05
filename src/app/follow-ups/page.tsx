'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  MoreHorizontal,
  Search,
  Plus,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFollowUps } from '@/actions/followUpActions';

import { AddFollowUpForm } from '@/components/forms/AddFollowUpForm';

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getFollowUps();
      setFollowUps(data);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return { icon: Phone, color: 'text-blue-600 bg-blue-50' };
      case 'meeting': return { icon: MapPin, color: 'text-emerald-600 bg-emerald-50' };
      case 'email': return { icon: Mail, color: 'text-orange-600 bg-orange-50' };
      default: return { icon: Calendar, color: 'text-slate-600 bg-slate-50' };
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Follow-Ups</h1>
          <p className="text-slate-500 mt-1">Never miss a customer interaction.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Schedule Follow-up
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <Clock className="w-6 h-6 text-red-600" />
          </div>
          <div>
             <p className="text-sm font-medium text-slate-500">Overdue</p>
             <h3 className="text-2xl font-bold text-slate-900">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div>
             <p className="text-sm font-medium text-slate-500">Today</p>
             <h3 className="text-2xl font-bold text-slate-900">8</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
             <p className="text-sm font-medium text-slate-500">Completed</p>
             <h3 className="text-2xl font-bold text-slate-900">145</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Upcoming Schedule</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100 min-h-[300px]">
          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : followUps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
               <Calendar className="w-12 h-12 text-slate-200 mb-2" />
               <p>No follow-ups scheduled.</p>
            </div>
          ) : followUps.map((task) => {
            const { icon: Icon, color: iconColor } = getTypeIcon(task.type);
            return (
              <div key={task.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-6">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", iconColor)}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{task.customers?.company_name}</h3>
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded",
                      task.priority === 'critical' ? "bg-red-100 text-red-600" :
                      task.priority === 'high' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(task.follow_up_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 capitalize">
                      <Clock className="w-3.5 h-3.5" />
                      {task.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                   <div className="flex gap-2">
                     {task.status === 'pending' && (
                       <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                         Complete
                       </button>
                     )}
                     <button className="p-2 text-slate-400 hover:text-slate-600">
                       <MoreHorizontal className="w-5 h-5" />
                     </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isModalOpen && <AddFollowUpForm onClose={() => setIsModalOpen(false)} onRefresh={fetchData} />}
    </div>
  );
}
