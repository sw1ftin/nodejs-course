export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  ROOM = 'room',
  HOTEL = 'hotel'
}

export function isPropertyType(value: unknown): PropertyType | undefined {
  return Object.values(PropertyType).includes(value as PropertyType) ? (value as PropertyType) : undefined;
}
