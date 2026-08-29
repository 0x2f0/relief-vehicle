const fs = require('fs');
const file = 'src/lib/types.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /export interface Pass \{([\s\S]*?)\}/,
  `export interface Pass {
  id: string;
  applicationId: string;
  qrCode: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'revoked' | 'expired';
  priority?: Priority;
  qr_token?: string;
  vehicle_number?: string;
  vehicle_type?: string;
  org_name?: string;
  driver_name?: string;
  driver_phone?: string;
  passenger_count?: number;
  travel_purpose?: string;
  approved_route?: string;
  departure_location?: string;
  destination?: string;
  valid_from: string;
  valid_until: string;
  issuing_authority?: string;
  issued_by?: string;
}`
);

fs.writeFileSync(file, code);
