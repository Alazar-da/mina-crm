// actions/leadActions.ts
'use server';

import { supabase } from '@/lib/supabase';
import { Lead } from '@/types';
import { revalidatePath } from 'next/cache';

// Fetch all leads
export async function getLeads() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Lead[];
  } catch (error) {
    console.error('Error in getLeads:', error);
    return [];
  }
}

// Fetch lead by ID
export async function getLeadById(id: string) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, profiles(full_name, email)')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('Error in getLeadById:', error);
    return null;
  }
}

// Create new lead
export async function createLead(leadData: Partial<Lead>) {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...leadData,
        owner_id: session.session?.user.id,
        status: 'new_lead',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    await logActivity('lead', 'created', data.id, data.lead_name);
    revalidatePath('/leads');
    return data;
  } catch (error) {
    console.error('Error in createLead:', error);
    throw error;
  }
}

// Update lead
export async function updateLead(id: string, leadData: Partial<Lead>) {
  try {
    // Get current lead data for logging
    const { data: currentLead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('leads')
      .update({
        ...leadData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    await logActivity('lead', 'updated', id, `Lead updated: ${currentLead?.lead_name} → ${leadData.lead_name || currentLead?.lead_name}`);
    revalidatePath('/leads');
    return data;
  } catch (error) {
    console.error('Error in updateLead:', error);
    throw error;
  }
}

// Update lead stage
export async function updateLeadStage(id: string, newStatus: string) {
  try {
    // Get current lead to log the change
    const { data: currentLead } = await supabase
      .from('leads')
      .select('status')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('leads')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
    
    await logActivity('lead', 'stage_updated', id, `Stage changed from ${currentLead?.status} to ${newStatus}`);
    revalidatePath('/leads');
  } catch (error) {
    console.error('Error in updateLeadStage:', error);
    throw error;
  }
}

// Update lead probability
export async function updateLeadProbability(id: string, probability: number) {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ 
        probability,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
    
    await logActivity('lead', 'probability_updated', id, `Probability updated to ${probability}%`);
    revalidatePath('/leads');
  } catch (error) {
    console.error('Error in updateLeadProbability:', error);
    throw error;
  }
}

// Delete lead
export async function deleteLead(id: string) {
  try {
    // Get lead info before deletion for logging
    const { data: lead } = await supabase
      .from('leads')
      .select('lead_name')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    
    await logActivity('lead', 'deleted', id, `Lead deleted: ${lead?.lead_name}`);
    revalidatePath('/leads');
  } catch (error) {
    console.error('Error in deleteLead:', error);
    throw error;
  }
}

// Get leads by stage
export async function getLeadsByStage() {
  try {
    const leads = await getLeads();
    const grouped = leads.reduce((acc, lead) => {
      const stage = lead.status || 'new_lead';
      if (!acc[stage]) acc[stage] = [];
      acc[stage].push(lead);
      return acc;
    }, {} as Record<string, Lead[]>);
    return grouped;
  } catch (error) {
    console.error('Error in getLeadsByStage:', error);
    return {};
  }
}

// Helper for Activity Logging
async function logActivity(module: string, action: string, entityId: string, entityName: string) {
  try {
    const { data: session } = await supabase.auth.getSession();
    await supabase.from('activity_log').insert([{
      user_id: session.session?.user.id,
      module,
      action,
      entity_id: entityId,
      entity_name: entityName,
      created_at: new Date().toISOString()
    }]);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}