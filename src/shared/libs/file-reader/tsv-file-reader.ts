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
            .map((parts) => ({
                title: parts[0],
                description: parts[1],
                publishDate: parts[2],
                city: parts[3],
                previewImage: parts[4],
                images: parts[5],
                isPremium: parts[6],
                isFavorite: parts[7],
                rating: parts[8],
                type: parts[9],
                rooms: parts[10],
                guests: parts[11],
                price: parts[12],
                amenities: parts[13],
                userEmail: parts[14],
                commentsCount: parts[15],
                location: parts[16],
            }))
            .map((offerData) => OfferFactory.create(offerData, users))
            .filter((offer): offer is Offer => offer !== null);
    }
}