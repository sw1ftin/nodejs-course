import { User } from './user.type.js';
import { PropertyType } from './property.enum.js';
import { CityName, Location } from './city.enum.js';
import { Amenity } from './amenity.enum.js';


export interface Offer {
  title: string;
  description: string;
  publishDate: Date;
  city: CityName;
  previewImage: string;
  images: [string, string, string, string, string, string];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: PropertyType;
  rooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  user: User;
  commentsCount: number;
  location: Location;
}

