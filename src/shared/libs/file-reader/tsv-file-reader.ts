import { FileReader } from "./file-reader.interface.js";
import { readFileSync } from "fs";
import { Offer, User } from "../../types/index.js";
import { OfferFactory } from "./factories/offer.factory.js";

export class TSVFileReader implements FileReader {
    private content: string = '';

    constructor(private readonly filename: string) {}

    public read(): void {
        this.content = readFileSync(this.filename, 'utf-8');
    }

    public toArray(users: User[]): Offer[] {
        if (!this.content) {
            throw new Error('File is not read yet. Call read() method before toArray().');
        }

        return this.content
            .split('\n')
            .filter((line) => line.trim().length > 0)
            .map((line) => line.trim().split('\t'))
            .filter((columns) => columns.length === 17)
            .map((parts) => {
                const [
                    title,
                    description,
                    publishDate,
                    city,
                    previewImage,
                    images,
                    isPremium,
                    isFavorite,
                    rating,
                    type,
                    rooms,
                    guests,
                    price,
                    amenities,
                    userEmail,
                    commentsCount,
                    location,
                ] = parts;
                return {
                    title,
                    description,
                    publishDate,
                    city,
                    previewImage,
                    images,
                    isPremium,
                    isFavorite,
                    rating,
                    type,
                    rooms,
                    guests,
                    price,
                    amenities,
                    userEmail,
                    commentsCount,
                    location,
                };
            })
            .map((offerData) => OfferFactory.create(offerData, users))
            .filter((offer): offer is Offer => offer !== null);
    }
}