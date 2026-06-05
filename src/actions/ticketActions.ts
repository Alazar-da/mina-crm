'use server';

import { supabase } from '@/lib/supabase';
import { Ticket } from '@/types';


export async function getTickets() {
  const { data, error } = await supabase
    .from('tickets')
    .select('*, customers(company_name)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTicketStatus(id: string, status: string) {
  const { error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(error.message);
  
  revalidatePath('/tickets');
}

export async function createTicket(ticketData: Partial<Ticket>) {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticketData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  revalidatePath('/tickets');
  return data;
}
