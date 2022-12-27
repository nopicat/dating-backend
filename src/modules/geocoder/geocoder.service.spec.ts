import { Test, TestingModule } from '@nestjs/testing';
import { GeocoderService } from './geocoder.service';

describe('GeocoderService', () => {
    let service: GeocoderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GeocoderService],
        }).compile();

        service = module.get<GeocoderService>(GeocoderService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
