import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { GeocoderService } from './geocoder.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Geocoder')
@Controller('geocoder')
export class GeocoderController {
    constructor(private readonly geocoderService: GeocoderService) {}

    @Get('suggestCity')
    public suggestCity(
        @Query('query') query: string,
        @Query('country', new DefaultValuePipe('ru')) country: 'ru',
    ) {
        return this.geocoderService.getCitiesByQuery(query, country);
    }
}
