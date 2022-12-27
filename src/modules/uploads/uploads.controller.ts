import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
    @Post('profilePhoto')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 3 * 1024 }),
                    new FileTypeValidator({ fileType: /jpg|jpeg|png/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {}
}
