export function calculatePriority(orgType: string, cargoType: string, vehicleType: string): string {
  if (orgType.toLowerCase() === 'medical' || cargoType.toLowerCase() === 'medical supplies') {
    return 'Critical';
  }
  if (cargoType.toLowerCase() === 'food' || orgType.toLowerCase() === 'government') {
    return 'High';
  }
  if (vehicleType.toLowerCase() === 'truck') {
    return 'Medium';
  }
  return 'Normal';
}
