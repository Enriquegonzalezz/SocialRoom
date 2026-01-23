import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para la base de datos
export interface EquipmentItem {
  id: string;
  name: string;
  barcode: string;
  category: 'camera' | 'microphone' | 'tripod' | 'lighting' | 'other';
  status: 'available' | 'checked_out';
  created_at: string;
}

export interface EquipmentLog {
  id: string;
  equipment_id: string;
  barcode: string;
  action: 'checkout' | 'return';
  user_name: string;
  timestamp: string;
  notes?: string;
}

export interface Lead {
  id?: string;
  name: string;
  country: string;
  industry: string;
  email: string;
  phone_code: string;
  phone_number: string;
  privacy_accepted: boolean;
  created_at?: string;
}
