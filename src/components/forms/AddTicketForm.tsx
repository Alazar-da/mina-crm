'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ticketSchema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export function AddTicketForm({ onClose, onRefresh }: { onClose: () => void, onRefresh: () => void }) {
  const [customers, setCustomers] = useState<{id: string, company_name: string}[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: 'medium' }
  });

  useEffect(() => {
    async function fetchCustomers() {
      const { data } = await supabase.from('customers').select('id, company_name');
      if (data) setCustomers(data);
    }
    fetchCustomers();
  }, []);

  const onSubmit = async (data: TicketFormValues) => {
    try {
      const { error } = await supabase.from('tickets').insert([{
        ...data,
        status: 'open'
      }]);
      if (error) throw error;
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Open New Ticket</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-bold">Customer</label>
            <select {...register('customer_id')} className="w-full px-4 py-2 border rounded-xl bg-white">
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
            {errors.customer_id && <p className="text-xs text-red-500">{errors.customer_id.message}</p>}
          </div>
          <div>
            <label className="text-sm font-bold">Subject</label>
            <input {...register('subject')} className="w-full px-4 py-2 border rounded-xl" placeholder="Describe the issue briefly" />
            {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
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
          <div>
            <label className="text-sm font-bold">Full Description</label>
            <textarea {...register('description')} className="w-full px-4 py-2 border rounded-xl" rows={4} placeholder="Details about the support request..." />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
            {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
}
