export interface Jurisdiction {
  id: string;
  name: string;
  type: 'city' | 'county';
  boundary: [number, number][]; // [longitude, latitude]
  nonEmergencyNumber: string;
  website?: string;
}
