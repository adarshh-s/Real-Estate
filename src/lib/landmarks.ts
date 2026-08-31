interface Landmark {
  name: string;
  category: string;
  lat: number;
  lng: number;
}

const LANDMARKS: Landmark[] = [
  { name: 'Dubai International Airport (DXB)', category: 'Airport', lat: 25.2532, lng: 55.3657 },
  { name: 'Al Maktoum International Airport (DWC)', category: 'Airport', lat: 24.8967, lng: 55.1614 },
  { name: 'The Dubai Mall', category: 'Shopping', lat: 25.1975, lng: 55.2796 },
  { name: 'Mall of the Emirates', category: 'Shopping', lat: 25.1181, lng: 55.2003 },
  { name: 'Burj Al Arab', category: 'Landmark', lat: 25.1412, lng: 55.1853 },
  { name: 'Burj Khalifa', category: 'Landmark', lat: 25.1972, lng: 55.2744 },
  { name: 'JBR Beach', category: 'Beach', lat: 25.0787, lng: 55.1339 },
  { name: 'Kite Beach', category: 'Beach', lat: 25.1571, lng: 55.1899 },
  { name: 'DIFC', category: 'Business District', lat: 25.2138, lng: 55.2822 },
  { name: 'Dubai Hills Mall', category: 'Shopping', lat: 25.1041, lng: 55.2445 },
  { name: 'American School of Dubai', category: 'School', lat: 25.1104, lng: 55.1969 },
  { name: 'Jumeirah English Speaking School', category: 'School', lat: 25.1544, lng: 55.1955 },
  { name: 'Expo City Dubai', category: 'Landmark', lat: 24.9625, lng: 55.1372 },
  { name: 'Dubai Marina Walk', category: 'Waterfront', lat: 25.0777, lng: 55.1394 },
];

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export interface NearbyLandmark {
  name: string;
  category: string;
  distanceKm: number;
  driveMinutes: number;
}

const AVG_CITY_SPEED_KMH = 45;

export function nearestLandmarks(origin: { lat: number; lng: number }, count = 5): NearbyLandmark[] {
  return LANDMARKS.map((l) => {
    const distanceKm = haversineKm(origin, l);
    return {
      name: l.name,
      category: l.category,
      distanceKm,
      driveMinutes: Math.max(3, Math.round((distanceKm / AVG_CITY_SPEED_KMH) * 60)),
    };
  })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, count);
}
