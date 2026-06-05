'use server';

import { supabase } from '@/lib/supabase';
import { FollowUp } from '@/types';


export async function getFollowUps(userId?: string) {
  let query = supabase.from('follow_ups').select('*, customers(company_name)');
  
  if (userId) {
    query = query.eq('assigned_user_id', userId);
  }

  const { data, error } = await query.order('follow_up_date', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function completeFollowUp(id: string, notes: string) {
  const { error } = await supabase
    .from('follow_ups')
    .update({ 
      status: 'completed',
      notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/follow-ups');
}

export async function scheduleFollowUp(followUpData: Partial<FollowUp>) {
  const { data, error } = await supabase
    .from('follow_ups')
    .insert([followUpData])
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Realtime Notification would be triggered by DB trigger or here
  await createNotification(
    followUpData.assigned_user_id!,
    'New Follow-up Assigned',
    `You have a new ${followUpData.type} scheduled.`,
    `/follow-ups`
  );

  revalidatePath('/follow-ups');
  return data;
}

async function createNotification(userId: string, title: string, message: string, link: string) {
  await supabase.from('notifications').insert([{
    user_id: userId,
    title,
    message,
    link
  }]);
}
