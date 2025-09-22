import { Offer, User } from '../../../types/index.js';
import { CityName, Location } from '../../../types/city.enum.js';
import { PropertyType } from '../../../types/property.enum.js';
import { Amenity } from '../../../types/amenity.enum.js';

export class OfferFactory {
    static create(
        rawData: {
            title: string;
            description: string;
            publishDate: string;
            city: string;
            previewImage: string;
            images: string;
            isPremium: string;
            isFavorite: string;
            rating: string;
            type: string;
            rooms: string;
            guests: string;
            price: string;
            amenities: string;
            userEmail: string;
            commentsCount: string;
            location: string;
        },
        users: User[]
    ): Offer | null {
        try {
            const title = rawData.title;
            const description = rawData.description;
            if (
                title.length < 10 || title.length > 100 ||
                description.length < 20 || description.length > 1024
            ) {
                return null;
            }

            let publishDate: Date;
            if (rawData.publishDate.includes('.')) {
                const parts = rawData.publishDate.split('.');
                if (parts.length === 3) {
                    const [d, m, y] = parts;
                    publishDate = new Date(Number(y), Number(m) - 1, Number(d));
                } else {
                    publishDate = new Date(rawData.publishDate);
                }
            } else {
                publishDate = new Date(rawData.publishDate);
            }
            if (isNaN(publishDate.getTime())) {
                return null;
            }

            const city = (Object.values(CityName) as string[]).includes(rawData.city)
                ? (rawData.city as CityName)
                : null;
            if (!city) {
                return null;
            }

            const previewImage = rawData.previewImage;
            if (!previewImage) {
                return null;
            }

            const images = rawData.images.split(' ').filter(Boolean);
            if (images.length !== 6 || images.some((img) => !img)) {
                return null;
            }

            const isPremium = rawData.isPremium === 'True';
            const isFavorite = rawData.isFavorite === 'True';

            const rating = parseFloat(rawData.rating.replace(',', '.'));
            if (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
                return null;
            }

            const type = (Object.values(PropertyType) as string[]).includes(rawData.type)
                ? (rawData.type as PropertyType)
                : null;
            if (!type) {
                return null;
            }

            const rooms = parseInt(rawData.rooms, 10);
            if (isNaN(rooms) || rooms < 1 || rooms > 8) {
                return null;
            }
            
            const guests = parseInt(rawData.guests, 10);
            if (isNaN(guests) || guests < 1 || guests > 10) {
                return null;
            }

            const price = parseInt(rawData.price, 10);
            if (isNaN(price) || price < 100 || price > 100000) {
                return null;
            }

            const amenities = rawData.amenities
                .split(',')
                .map((amenity) => amenity.trim())
                .map((amenity) => {
                    const found = (Object.values(Amenity) as string[]).find(v => v === amenity);
                    return found as Amenity | undefined;
                })
                .filter((amenity): amenity is Amenity => Boolean(amenity));
            if (amenities.length === 0) {
                return null;
            }

            const user = users.find((u) => u.email === rawData.userEmail || u.name === rawData.userEmail);
            if (!user) {
                return null;
            }

            const commentsCount = parseInt(rawData.commentsCount, 10);
            if (isNaN(commentsCount) || commentsCount < 0) {
                return null;
            }

            const [latitudeStr, longitudeStr] = rawData.location.split(' ').filter(Boolean);
            const latitude = parseFloat(latitudeStr);
            const longitude = parseFloat(longitudeStr);
            if (
                isNaN(latitude) || latitude < -90 || latitude > 90 ||
                isNaN(longitude) || longitude < -180 || longitude > 180
            ) {
                return null;
            }
            const location: Location = { latitude, longitude };

            return {
                title,
                description,
                publishDate,
                city,
                previewImage,
                images: images as [string, string, string, string, string, string],
                isPremium,
                isFavorite,
                rating,
                type,
                rooms,
                guests,
                price,
                amenities,
                user,
                commentsCount,
                location
            };
        } catch {
            return null;
        }
    }
}