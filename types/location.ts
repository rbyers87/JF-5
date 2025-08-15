export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CityData {
  name: string;
  county: string;
  policePhone?: string;
  policeWebsite?: string;
  address?: string;
}

export interface CountyData {
  name: string;
  sheriffPhone?: string;
  sheriffWebsite?: string;
  address?: string;
}

export interface LocationData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  city?: CityData;
  county?: CountyData;
  jurisdiction: 'city' | 'county' | 'state';
  primaryAgency: {
    name: string;
    type: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  // Add this new field
  boundary: [number, number][]; // [longitude, latitude]
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  address: string;
}
