export enum Amenity {
  BREAKFAST = 'Breakfast',
  AIR_CONDITIONING = 'Air conditioning',
  LAPTOP_FRIENDLY_WORKSPACE = 'Laptop friendly workspace',
  BABY_SEAT = 'Baby seat',
  WASHER = 'Washer',
  TOWELS = 'Towels',
  FRIDGE = 'Fridge'
}

export function isAmenity(value: unknown): Amenity | undefined {
  return Object.values(Amenity).includes(value as Amenity) ? (value as Amenity) : undefined;
}
