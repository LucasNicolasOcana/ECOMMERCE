import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesUploadService } from './files_upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
@ApiTags('Files Upload')
@Controller('files')
export class FilesUploadController {
    constructor(private readonly fileUploadService: FilesUploadService) {}

    @ApiBearerAuth()
    @Post('uploadImage/:id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    uploadImage(
        @Param('id') productId: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 20000000,
                        message: 'Supera el peso máximo permitido',
                    }),
                    new FileTypeValidator({
                        fileType: /(jpg|jpeg|png|webp|svg)/,
                    }),
                ],
            }),
        ) file: Express.Multer.File,
    ) {
        return this.fileUploadService.uploadImage(file, productId);
    }
}
