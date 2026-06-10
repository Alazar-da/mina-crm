'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreHorizontal, FileText, Calendar, DollarSign, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
/* import { getContracts } from '@/actions/contractActions'; */

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

/*   useEffect(() => {
    async function fetchData() {
      try {
        const data = await getContracts();
        setContracts(data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []); */

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contracts</h1>
          <p className="text-slate-500 mt-1">Manage customer agreements and expirations.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Contract
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-sm font-medium text-slate-500">Active Contracts</p>
           <h3 className="text-2xl font-bold text-slate-900 mt-1">{contracts.filter(c => c.status === 'active').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-sm font-medium text-slate-500">Total Value</p>
           <h3 className="text-2xl font-bold text-slate-900 mt-1">
             ${contracts.reduce((acc, c) => acc + (Number(c.value) || 0), 0).toLocaleString()}
           </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-sm font-medium text-slate-500">Expiring Soon</p>
           <h3 className="text-2xl font-bold text-orange-600 mt-1">
             {contracts.filter(c => {
               const diff = new Date(c.end_date).getTime() - new Date().getTime();
               return diff > 0 && diff < (30 * 24 * 60 * 60 * 1000);
             }).length}
           </h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No contracts found.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Contract #</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">End Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Value</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{c.contract_number}</td>
                    <td className="px-6 py-4">{c.customers?.company_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(c.end_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">${Number(c.value).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                        c.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      )}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-blue-600 hover:underline text-sm font-bold">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
