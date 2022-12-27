import { Exclude, Expose, Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export class CardResponseDto {
    constructor(data: Partial<CardResponseDto>) {
        Object.assign(this, data);
    }

    public id: number;
    public firstName: string;
    public lastName: string;

    @Exclude()
    public birthday: Date;

    @Expose()
    public get age(): number {
        return Math.floor(Math.abs(DateTime.fromJSDate(this.birthday).diffNow('years').years));
    }

    public about: string;
    public city: string;
    public countryCode: string;
    public blurHashPhoto: string;
    public photo: string;

    // приблизительная дистанция в км
    @Transform(({ value }) => Math.round(value / 5) * 5)
    public distance: number;
}
