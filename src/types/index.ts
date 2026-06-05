export type UserRole = 'super_admin' | 'sales_manager' | 'account_manager' | 'support_agent';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
  status: 'active' | 'inactive';
  avatar_url?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  company_name: string;
  customer_code: string;
  contact_person: string;
  email: string;
  phone: string;
  secondary_phone?: string;
  industry?: string;
  company_size?: string;
  website?: string;
  address?: string;
  country?: string;
  city?: string;
  tax_number?: string;
  status: CustomerStatus;
  health_score: 'excellent' | 'good' | 'warning' | 'at_risk';
  assigned_manager_id?: string;
  registration_date: string;
  created_at: string;
}

export type CustomerStatus = 
  | 'new_lead' 
  | 'contacted' 
  | 'interested' 
  | 'demo_scheduled' 
  | 'proposal_sent' 
  | 'negotiation' 
  | 'won' 
  | 'lost' 
  | 'active' 
  | 'inactive';

export interface Lead {
  id: string;
  lead_name: string;
  company?: string;
  source: string;
  email?: string;
  phone?: string;
  estimated_value?: number;
  status: string;
  probability: number;
  owner_id?: string;
  notes?: string;
  created_at: string;
}

export interface FollowUp {
  id: string;
  customer_id: string;
  assigned_user_id: string;
  type: 'call' | 'meeting' | 'email' | 'checkup' | 'site_visit';
  follow_up_date: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'completed' | 'missed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: number;
  customer_id: string;
  subject: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  assigned_agent_id?: string;
  created_at: string;
}

export interface Contract {
  id: string;
  contract_number: string;
  customer_id: string;
  start_date: string;
  end_date: string;
  value?: number;
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  file_url?: string;
  created_at: string;
}
