import { Module } from '@nestjs/common';
import { GeocoderService } from './geocoder.service';
import { GeocoderController } from './geocoder.controller';

@Module({
    providers: [GeocoderService],
    controllers: [GeocoderController],
})
export class GeocoderModule {}
