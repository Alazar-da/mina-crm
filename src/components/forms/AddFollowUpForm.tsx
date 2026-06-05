'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const followUpSchema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  type: z.enum(['call', 'meeting', 'email', 'checkup', 'site_visit']),
  follow_up_date: z.string().min(1, 'Date is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  notes: z.string().optional(),
});

type FollowUpFormValues = z.infer<typeof followUpSchema>;

export function AddFollowUpForm({ onClose, onRefresh }: { onClose: () => void, onRefresh: () => void }) {
  const [customers, setCustomers] = useState<{id: string, company_name: string}[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpSchema),
    defaultValues: { type: 'call', priority: 'medium' }
  });

  useEffect(() => {
    async function fetchCustomers() {
      const { data } = await supabase.from('customers').select('id, company_name');
      if (data) setCustomers(data);
    }
    fetchCustomers();
  }, []);

  const onSubmit = async (data: FollowUpFormValues) => {
    try {
      const { error } = await supabase.from('follow_ups').insert([{
        ...data,
        status: 'pending'
      }]);
      if (error) throw error;
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Schedule Follow-up</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-bold">Customer</label>
            <select {...register('customer_id')} className="w-full px-4 py-2 border rounded-xl bg-white">
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold">Type</label>
              <select {...register('type')} className="w-full px-4 py-2 border rounded-xl bg-white">
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="email">Email</option>
                <option value="checkup">Checkup</option>
                <option value="site_visit">Site Visit</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold">Priority</label>
              <select {...register('priority')} className="w-full px-4 py-2 border rounded-xl bg-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-bold">Date & Time</label>
            <input {...register('follow_up_date')} type="datetime-local" className="w-full px-4 py-2 border rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-bold">Notes</label>
            <textarea {...register('notes')} className="w-full px-4 py-2 border rounded-xl" rows={3} />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
            {isSubmitting ? 'Scheduling...' : 'Schedule Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
