import { CityName, PropertyType, Amenity, Location } from '../../../types/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publishDate!: Date;
  public city!: CityName;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: PropertyType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public amenities!: Amenity[];
  public userId!: string;
  public commentsCount!: number;
  public location!: Location;
}
