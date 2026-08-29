const fs = require('fs');
const file = 'src/lib/types.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /export interface AuditLog \{([\s\S]*?)\}/,
  `export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  timestamp: string;
  details: string;
  entity_id?: string;
  actor_name?: string;
  actor_role?: string;
  ip_address?: string;
}`
);

code += `\nexport interface CoordinationDashboardData {
  duplicateAlerts: any[];
  destinations?: any[];
  routes?: any[];
  roadHazards?: any[];
}\n`;

fs.writeFileSync(file, code);
