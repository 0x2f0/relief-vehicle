export const schema = `
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  org_name TEXT NOT NULL,
  org_type TEXT NOT NULL,
  org_id TEXT,
  vehicle_number TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_owner TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  passenger_count INTEGER NOT NULL,
  vehicle_capacity TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  departure_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  intermediate_checkpoints TEXT,
  departure_time TEXT NOT NULL,
  return_time TEXT NOT NULL,
  proposed_route TEXT NOT NULL,
  travel_purpose TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  cargo_details TEXT NOT NULL,
  supporting_documents TEXT,
  priority TEXT NOT NULL DEFAULT 'Normal',
  status TEXT NOT NULL DEFAULT 'submitted',
  admin_notes TEXT,
  info_request_reason TEXT,
  secret_token TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS passes (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id),
  qr_token TEXT NOT NULL,
  issued_by TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  valid_from TEXT NOT NULL,
  valid_until TEXT NOT NULL,
  approved_route TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  revocation_reason TEXT,
  revoked_at TEXT,
  revoked_by TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkpoint_scans (
  id TEXT PRIMARY KEY,
  pass_id TEXT NOT NULL REFERENCES passes(id),
  checkpoint_id TEXT NOT NULL,
  scanned_by TEXT NOT NULL,
  scanned_at TEXT NOT NULL,
  scan_location TEXT NOT NULL,
  scan_notes TEXT
);

CREATE TABLE IF NOT EXISTS road_conditions (
  id TEXT PRIMARY KEY,
  road_name TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  reported_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkpoints (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT,
  highway TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  full_name TEXT,
  checkpoint_name TEXT,
  badge_number TEXT,
  phone TEXT,
  created_at TEXT NOT NULL
);
`;
