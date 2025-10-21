export enum CityName {
  PARIS = 'Paris',
  COLOGNE = 'Cologne',
  BRUSSELS = 'Brussels',
  AMSTERDAM = 'Amsterdam',
  HAMBURG = 'Hamburg',
  DUSSELDORF = 'Dusseldorf'
}

export interface Location {
  latitude: number;
  longitude: number;
}

export const CITY_COORDINATES: Record<CityName, Location> = {
  [CityName.PARIS]: { latitude: 48.85661, longitude: 2.351499 },
  [CityName.COLOGNE]: { latitude: 50.938361, longitude: 6.959974 },
  [CityName.BRUSSELS]: { latitude: 50.846557, longitude: 4.351697 },
  [CityName.AMSTERDAM]: { latitude: 52.370216, longitude: 4.895168 },
  [CityName.HAMBURG]: { latitude: 53.550341, longitude: 10.000654 },
  [CityName.DUSSELDORF]: { latitude: 51.225402, longitude: 6.776314 }
};