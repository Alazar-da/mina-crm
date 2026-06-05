'use server';

import { supabase } from '@/lib/supabase';
import { Contract } from '@/types';


export async function getContracts() {
  const { data, error } = await supabase
    .from('contracts')
    .select('*, customers(company_name)')
    .order('end_date', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getExpiringContracts() {
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

  const { data, error } = await supabase
    .from('contracts')
    .select('*, customers(company_name)')
    .lte('end_date', ninetyDaysFromNow.toISOString())
    .eq('status', 'active');

  if (error) throw new Error(error.message);
  return data;
}

export async function uploadContractFile(contractId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${contractId}-${Math.random()}.${fileExt}`;
  const filePath = `contracts/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  await supabase
    .from('contracts')
    .update({ file_url: publicUrl })
    .eq('id', contractId);

  revalidatePath('/contracts');
}
