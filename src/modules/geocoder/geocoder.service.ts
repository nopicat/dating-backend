import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocoderService {
    constructor() {}

    public async getCitiesByQuery(query: string, country: 'ru') {
        return axios
            .get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    featuretype: 'city',
                    countrycodes: country,
                    format: 'jsonv2',
                },
            })
            .then(({ data }) =>
                data
                    .filter((feature) => feature.place_rank >= 16 && feature.place_rank <= 19)
                    .map((feature) => ({
                        osmId: feature.osm_id,
                        name: feature.display_name,
                        latitude: +(+feature.lat).toFixed(7),
                        longitude: +(+feature.lon).toFixed(7),
                    })),
            );
    }

    // не сегодня
    // TODO
    public async getCityByCoordinates(latitude: number, longitude: number) {
        return axios
            .get('https://nominatim.openstreetmap.org/reverse', {
                params: {
                    lat: latitude,
                    lon: longitude,
                    zoom: '14',
                    format: 'jsonv2',
                },
            })

            .then(async ({ data }) => {
                if (data.place_rank >= 16 && data.place_rank <= 19) {
                    return {
                        name: (data.address.city ||
                            data.address.town ||
                            data.address.village) as string,
                        country: data.address.country as string,
                        countryCode: data.address.country_code as string,
                    };
                }

                return null;
            });
    }

    public async getCityByOsmId(osmId: number) {
        return axios
            .get('https://nominatim.openstreetmap.org/lookup', {
                params: {
                    osm_ids: `R${osmId}`,
                    format: 'jsonv2',
                },
            })

            .then(({ data }) => {
                if (data.place_rank >= 16 && data.place_rank <= 19) {
                    return {
                        name: data.name,
                        country: data.country,
                    };
                }

                return null;
            });
    }
}
