export function calculatePriority(orgType: string, cargoType: string, vehicleType: string): string {
  const org = (orgType || '').toLowerCase();
  const cargo = (cargoType || '').toLowerCase();
  const vehicle = (vehicleType || '').toLowerCase();

  // Tier 1: Critical (P1) - Life-saving rescue, medical evacuation, search teams
  if (
    org.includes('rescue') ||
    org.includes('medical') ||
    cargo.includes('rescue') ||
    cargo.includes('medical') ||
    cargo.includes('oxygen') ||
    cargo.includes('blood') ||
    vehicle.includes('ambulance') ||
    vehicle.includes('boat')
  ) {
    return 'Critical';
  }

  // Tier 2: High (P2) - Food, clean drinking water, nutrition, shelter kits, government relief
  if (
    cargo.includes('food') ||
    cargo.includes('water') ||
    cargo.includes('grain') ||
    cargo.includes('ration') ||
    cargo.includes('nutrition') ||
    cargo.includes('baby') ||
    cargo.includes('shelter') ||
    cargo.includes('tent') ||
    cargo.includes('tarpaulin') ||
    org.includes('government') ||
    org.includes('relief')
  ) {
    return 'High';
  }

  // Tier 3: Medium (P3) - Essential logistics, volunteers, sanitation kits, heavy vehicles
  if (
    cargo.includes('essential') ||
    cargo.includes('volunteer') ||
    cargo.includes('hygiene') ||
    cargo.includes('blanket') ||
    cargo.includes('clothing') ||
    cargo.includes('fuel') ||
    vehicle.includes('truck') ||
    vehicle.includes('pickup') ||
    org.includes('volunteer') ||
    org.includes('logistics')
  ) {
    return 'Medium';
  }

  return 'Normal';
}
