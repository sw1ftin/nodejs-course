import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, Amenity, PropertyType, CityName, UserType } from '../../types/index.js';
import { MAX_COMMENTS_COUNT, MAX_GUESTS, MAX_PRICE, MAX_RATING, MAX_ROOMS, MIN_COMMENTS_COUNT, MIN_GUESTS, MIN_PRICE, MIN_RATING, MIN_ROOMS, IMAGES_COUNT, LATITUDE_MIN, LATITUDE_MAX, LONGITUDE_MAX, LONGITUDE_MIN, DECIMALS_COORD } from '../../constants.js';
import { generateRandomNumber, getRandomArrayElement, getRandomBoolean, getRandomCoordinate, getRandomEnumValue, getRandomEnumValues } from '../../helpers/index.js';

export class TsvOfferGenerator implements OfferGenerator {
    constructor(private readonly mockData: MockServerData) { }

    public generate(): string {
        const title = getRandomArrayElement(this.mockData.titles);
        const description = getRandomArrayElement(this.mockData.descriptions);

        const publishDate = dayjs().subtract(generateRandomNumber(0, 90), 'day').format('DD.MM.YYYY');

        const city = getRandomEnumValue(CityName);

        const previewImage = getRandomArrayElement(this.mockData.images);
        const [previewImageName, fileExtension] = previewImage.split('.');
        const images = [];
        for (let i = 0; i < IMAGES_COUNT; i++) {
            images.push(`${previewImageName}-${i}.${fileExtension}`);
        }

        const isPremium = getRandomBoolean();
        const isFavorite = getRandomBoolean();

        const rating = generateRandomNumber(MIN_RATING, MAX_RATING, 1);

        const type = getRandomEnumValue(PropertyType);
        const rooms = generateRandomNumber(MIN_ROOMS, MAX_ROOMS);
        const guests = generateRandomNumber(MIN_GUESTS, MAX_GUESTS);

        const price = generateRandomNumber(MIN_PRICE, MAX_PRICE);

        const amenitiesCount = generateRandomNumber(1, Object.keys(Amenity).length);
        const amenities = getRandomEnumValues(Amenity, amenitiesCount).join(',');

        const userName = getRandomArrayElement(this.mockData.users);
        const email = getRandomArrayElement(this.mockData.emails);
        const password = getRandomArrayElement(this.mockData.passwords);
        const avatar = getRandomArrayElement(this.mockData.avatars);
        const userType = getRandomEnumValue(UserType);

        const commentsCount = generateRandomNumber(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT);

        const latitude = getRandomCoordinate(LATITUDE_MIN, LATITUDE_MAX, DECIMALS_COORD);
        const longitude = getRandomCoordinate(LONGITUDE_MIN, LONGITUDE_MAX, DECIMALS_COORD);

        return [
            title,
            description,
            publishDate,
            city,
            previewImage,
            images.join(' '),
            isPremium,
            isFavorite,
            rating,
            type,
            rooms,
            guests,
            price,
            amenities,
            userName,
            email,
            avatar,
            password,
            userType,
            commentsCount,
            latitude,
            longitude
        ].join('\t');
    }
}
