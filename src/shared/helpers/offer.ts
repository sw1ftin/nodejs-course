import { Offer, User, isCityName, isAmenity, PropertyType, isPropertyType, isUserType, UserType, CityName, Amenity } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [title,
    description,
    publishDate,
    city,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    housingType,
    rooms,
    guests,
    price,
    amenities,
    name,
    email,
    avatarUrl,
    password,
    typeRaw,
    commentsCount,
    latitude,
    longitude
  ] = offerData.replace('\n','').split('\t');
  let user: User = {
    name,
    email,
    avatarUrl,
    password,
    type: isUserType(typeRaw) ?? UserType.REGULAR
  };

  return {
    title,
    description,
    publishDate: new Date(publishDate.split('.').reverse().join('-')),
    city: isCityName(city) ?? CityName.AMSTERDAM,
    previewImage: previewImage,
    images: images.split(' ') as [string, string, string, string, string, string],
    isPremium: isPremium.toLowerCase() === 'true',
    isFavorite: isFavorite.toLowerCase() === 'true',
    rating: parseFloat(rating),
    type: isPropertyType(housingType) ?? PropertyType.APARTMENT,
    rooms: parseInt(rooms, 10),
    guests: parseInt(guests, 10),
    price: parseInt(price, 10),
    amenities: amenities.split(',').map((c) => isAmenity(c.trim()) ?? Amenity.FRIDGE),
    user,
    commentsCount: Number.parseInt(commentsCount, 10),
    location: {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude)
    }
  };
}