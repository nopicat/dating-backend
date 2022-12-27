export class SuggestedCityDto {
    constructor(data: Partial<SuggestedCityDto>) {
        Object.assign(this, data);
    }

    public name: string;
    public country: string;
    public lat: number;
    public lon: number;
}
