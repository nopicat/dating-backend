import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

describe('UploadsController', () => {
    let controller: UploadsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UploadsService],
            controllers: [UploadsController],
        }).compile();

        controller = module.get<UploadsController>(UploadsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
