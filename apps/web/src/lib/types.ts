export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'info_requested'
  | 'approved'
  | 'rejected'
  | 'issued'
  | 'active'
  | 'completed'
  | 'held'
  | 'revoked'
  | 'expired';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Normal';

export interface User {
  id: string;
  username: string;
  role: string;
  district?: string;
}

export interface Application {
  id: string;
  applicant_name: string;
  applicant_phone: string;
  applicant_email: string;
  org_name: string;
  org_type: string;
  org_id?: string;
  vehicle_number: string;
  vehicle_type: string;
  vehicle_owner: string;
  driver_name: string;
  driver_phone: string;
  passenger_count: number;
  vehicle_capacity: string;
  emergency_contact: string;
  departure_location: string;
  destination: string;
  intermediate_checkpoints?: string;
  departure_time: string;
  return_time: string;
  proposed_route: string;
  travel_purpose: string;
  cargo_type: string;
  cargo_details: string;
  supporting_documents?: string;
  priority: Priority;
  status: ApplicationStatus;
  admin_notes?: string;
  info_request_reason?: string;
  secret_token?: string;
  pass_id?: string | null;
  pass_status?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pass {
  id: string;
  application_id: string;
  qr_token: string;
  issued_by: string;
  issuing_authority: string;
  valid_from: string;
  valid_until: string;
  approved_route: string;
  status: 'active' | 'completed' | 'revoked' | 'expired';
  revocation_reason?: string;
  revoked_at?: string;
  revoked_by?: string;
  created_at: string;
  // Joined application fields for display
  applicant_name?: string;
  org_name?: string;
  vehicle_number?: string;
  vehicle_type?: string;
  driver_name?: string;
  driver_phone?: string;
  passenger_count?: number;
  travel_purpose?: string;
  cargo_type?: string;
  departure_location?: string;
  destination?: string;
  priority?: Priority;
}

export interface CheckpointScan {
  id: string;
  pass_id: string;
  checkpoint_name: string;
  officer_name: string;
  officer_badge?: string;
  direction: 'outbound' | 'inbound' | 'transit';
  latitude?: number;
  longitude?: number;
  scan_result: 'valid' | 'invalid' | 'expired' | 'revoked';
  notes?: string;
  scanned_at: string;
}

export interface RoadCondition {
  id: string;
  road_name: string;
  status: 'open' | 'closed' | 'restricted' | 'emergency_only';
  description?: string;
  reason?: string;
  reported_by?: string;
  reported_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  actor_id?: string;
  actor_name?: string;
  actor_role?: string;
  ip_address?: string;
  details?: string;
  created_at: string;
}

export interface PublicStats {
  activePasses: number;
  approvedApplications: number;
  roadUpdates: number;
  checkpointScans: number;
}

export interface CoordinationDashboardData {
  duplicateAlerts?: any[];
  destinations?: Array<{ destination: string; count: number }>;
  routes?: Array<{ route: string; count: number }>;
  roadHazards?: Array<{ road: string; status: string; reason: string }>;
  statusSummary?: Record<string, number>;
}

