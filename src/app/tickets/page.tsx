'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreHorizontal, Ticket, Clock, AlertCircle, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTickets } from '@/actions/ticketActions';
import { AddTicketForm } from '@/components/forms/AddTicketForm';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support Tickets</h1>
          <p className="text-slate-500 mt-1">Manage customer support requests and issues.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Open Ticket
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No support tickets found.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ticket</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Created</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{t.subject}</p>
                        <p className="text-[10px] text-slate-400 font-mono">#{t.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{t.customers?.company_name}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", getPriorityColor(t.priority))}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className={cn("w-1.5 h-1.5 rounded-full", t.status === 'open' ? "bg-red-500" : "bg-emerald-500")} />
                       <span className="text-xs font-medium capitalize">{t.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{new Date(t.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                     <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && <AddTicketForm onClose={() => setIsModalOpen(false)} onRefresh={fetchData} />}
    </div>
  );
}
