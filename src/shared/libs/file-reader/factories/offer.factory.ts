import { Offer, User } from '../../../types/index.js';
import { CityName, Location } from '../../../types/city.enum.js';
import { PropertyType } from '../../../types/property.enum.js';
import { Amenity } from '../../../types/amenity.enum.js';

const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 1024;

const IMAGES_COUNT = 6;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const MIN_COMMENTS_COUNT = 0;

const LATITUDE_MIN = -90;
const LATITUDE_MAX = 90;
const LONGITUDE_MIN = -180;
const LONGITUDE_MAX = 180;

type RawOffer = {
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
};

export class OfferFactory {
    static create(
        rawData: RawOffer,
        users: User[]
    ): Offer | null {
        try {
            const title = rawData.title;
            const description = rawData.description;
            if (
                title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH ||
                description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH
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
            if (images.length !== IMAGES_COUNT || images.some((img) => !img)) {
                return null;
            }

            const isPremium = rawData.isPremium === 'True';
            const isFavorite = rawData.isFavorite === 'True';

            const rating = parseFloat(rawData.rating.replace(',', '.'));
            if (isNaN(Number(rating)) || Number(rating) < MIN_RATING || Number(rating) > MAX_RATING) {
                return null;
            }

            const type = (Object.values(PropertyType) as string[]).includes(rawData.type)
                ? (rawData.type as PropertyType)
                : null;
            if (!type) {
                return null;
            }

            const rooms = parseInt(rawData.rooms, 10);
            if (isNaN(rooms) || rooms < MIN_ROOMS || rooms > MAX_ROOMS) {
                return null;
            }
            
            const guests = parseInt(rawData.guests, 10);
            if (isNaN(guests) || guests < MIN_GUESTS || guests > MAX_GUESTS) {
                return null;
            }

            const price = parseInt(rawData.price, 10);
            if (isNaN(price) || price < MIN_PRICE || price > MAX_PRICE) {
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
            if (isNaN(commentsCount) || commentsCount < MIN_COMMENTS_COUNT) {
                return null;
            }

            const [latitudeStr, longitudeStr] = rawData.location.split(' ').filter(Boolean);
            const latitude = parseFloat(latitudeStr);
            const longitude = parseFloat(longitudeStr);
            if (
                isNaN(latitude) || latitude < LATITUDE_MIN || latitude > LATITUDE_MAX ||
                isNaN(longitude) || longitude < LONGITUDE_MIN || longitude > LONGITUDE_MAX
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