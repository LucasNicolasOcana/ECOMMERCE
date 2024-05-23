import { Module } from '@nestjs/common';
import { FilesUploadController } from './files_upload.controller';
import { FilesUploadService } from './files_upload.service';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { FileUploadRepository } from './files_upload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  controllers: [FilesUploadController],
  providers: [FilesUploadService, CloudinaryConfig, FileUploadRepository]
})
export class FilesUploadModule {}
