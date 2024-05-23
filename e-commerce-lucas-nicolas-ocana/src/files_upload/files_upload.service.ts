import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './files_upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity'
import { Repository } from 'typeorm';

@Injectable()
export class FilesUploadService {
    constructor(private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>
    ) {}

    async uploadImage(file: Express.Multer.File, productId: string) {
        const product = await this.productsRepository.findOneBy({id: productId});
        if (!product) throw new NotFoundException('Producto con id ${productId} no encontrado');
        const response = await this.fileUploadRepository.uploadImage(file);
        await this.productsRepository.update(productId, {
            imgUrl: response.secure_url,
        });
        const foundProduct = this.productsRepository.findOneBy({id: productId});
        return foundProduct;
    }
}
