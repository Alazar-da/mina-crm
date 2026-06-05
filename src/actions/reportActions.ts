'use server';

import { supabase } from '@/lib/supabase';

export async function getDashboardStats() {
  const [
    { count: totalCustomers },
    { count: newLeads },
    { data: revenueData },
    { count: openTickets }
  ] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new_lead'),
    supabase.from('contracts').select('value').eq('status', 'active'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).neq('status', 'closed')
  ]);

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0) || 0;

  return {
    totalCustomers: totalCustomers || 0,
    newLeads: newLeads || 0,
    totalRevenue,
    openTickets: openTickets || 0
  };
}

export async function getMonthlyGrowth() {
  const { data, error } = await supabase.rpc('get_monthly_customer_growth');
  if (error) throw new Error(error.message);
  return data;
}
