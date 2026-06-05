// actions/customerActions.ts
'use server';

import { supabase } from '@/lib/supabase';
import { Customer, CustomerStatus } from '@/types';
import { revalidatePath } from 'next/cache';

// Fetch all customers with optional filters
export async function getCustomers(filters?: { status?: string; search?: string }) {
  let query = supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.search) {
    query = query.or(`company_name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data as Customer[];
}

// Fetch a single customer by ID
export async function getCustomerById(id: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*, profiles(full_name, email)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Create a new customer
export async function createCustomer(customerData: Partial<Customer>) {
  // Generate customer code if not provided
  if (!customerData.customer_code) {
    const count = await supabase.from('customers').select('id', { count: 'exact', head: true });
    const nextNumber = (count.count || 0) + 1;
    customerData.customer_code = `CUST-${String(nextNumber).padStart(4, '0')}`;
  }

  const { data: session } = await supabase.auth.getSession();
  const userId = session.session?.user.id;

  const { data, error } = await supabase
    .from('customers')
    .insert([{
      ...customerData,
      created_by: userId,
      registration_date: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  // Log activity
  await logActivity('customer', 'created', data.id, data.company_name);
  
  revalidatePath('/customers');
  return data;
}

// Update customer
export async function updateCustomer(id: string, customerData: Partial<Customer>) {
  const { data, error } = await supabase
    .from('customers')
    .update(customerData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  await logActivity('customer', 'updated', id, customerData.company_name || '');
  
  revalidatePath('/customers');
  revalidatePath(`/customers/${id}`);
  return data;
}

// Update customer status and record in history
export async function updateCustomerStatus(id: string, newStatus: CustomerStatus) {
  // Get current status first
  const { data: current } = await supabase
    .from('customers')
    .select('status')
    .eq('id', id)
    .single();

  const { error: updateError } = await supabase
    .from('customers')
    .update({ status: newStatus })
    .eq('id', id);

  if (updateError) throw new Error(updateError.message);

  // Record status history
  const { data: session } = await supabase.auth.getSession();
  await supabase.from('status_history').insert([{
    customer_id: id,
    old_status: current?.status,
    new_status: newStatus,
    changed_by: session.session?.user.id
  }]);

  await logActivity('customer', 'status_updated', id, `Status changed to ${newStatus}`);
  
  revalidatePath('/customers');
  revalidatePath(`/customers/${id}`);
}

// Delete customer
export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  
  await logActivity('customer', 'deleted', id, 'Customer deleted');
  
  revalidatePath('/customers');
}

// Add note to customer
export async function addCustomerNote(customerId: string, content: string) {
  const { data: session } = await supabase.auth.getSession();
  
  const { data, error } = await supabase
    .from('customer_notes')
    .insert([{
      customer_id: customerId,
      author_id: session.session?.user.id,
      content
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  
  revalidatePath(`/customers/${customerId}`);
  return data;
}

// Get customer notes
export async function getCustomerNotes(customerId: string) {
  const { data, error } = await supabase
    .from('customer_notes')
    .select('*, profiles(full_name, email)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Helper for Activity Logging
async function logActivity(module: string, action: string, entityId: string, entityName: string) {
  const { data: session } = await supabase.auth.getSession();
  await supabase.from('activity_log').insert([{
    user_id: session.session?.user.id,
    module,
    action,
    entity_id: entityId,
    entity_name: entityName,
    created_at: new Date().toISOString()
  }]);
}

// Get customer status history
export async function getCustomerStatusHistory(customerId: string) {
  const { data, error } = await supabase
    .from('status_history')
    .select('*, profiles(full_name, email)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}