// Run this once in your browser console or create a setup page
import { supabase } from '@/lib/supabase';
const createAdminUser = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@minatech.com',
    password: 'Admin123!',
    options: {
      data: {
        full_name: 'Admin User',
        phone: '+1 234 567 8900',
        department: 'Administration'
      }
    }
  });
  
  if (error) {
    console.error('Error creating admin:', error);
  } else {
    console.log('Admin user created:', data);
  }
};

createAdminUser();