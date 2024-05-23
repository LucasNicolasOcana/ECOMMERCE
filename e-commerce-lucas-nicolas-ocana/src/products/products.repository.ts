import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entities/category.entity";
import { Products } from "src/entities/products.entity";
import { Repository } from "typeorm";
import * as data from "../utils/data.json"

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Products[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
  
    let products = await this.productsRepository.find({
      relations: {
        category: true,
      },
    });
  
    products = products.slice(startIndex, endIndex);
  
    return products;
  }

  async getProduct(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      return `Producto con id ${id} no encontrado`;
    }
    return product;
  }

  async addProducts() {
    try {
      const categories = await this.categoryRepository.find();
      if (categories.length === 0) {
        return 'No se pueden agregar productos sin categorías.';
      }

      // Obtener los nombres de los productos existentes
      const existingProducts = await this.productsRepository.find();
      const existingProductNames = existingProducts.map(product => product.name);

      // Verificar si los productos ya existen
      const newProductNames = data.map(element => element.name);
      const duplicateProducts = newProductNames.filter(name => existingProductNames.includes(name));

      // Si hay productos duplicados, retornar el mensaje
      if (duplicateProducts.length > 0) {
        return 'Los productos ya son existentes en nuestra base de datos.';
      }

      // Insertar nuevos productos
      await Promise.all(data.map(async (element) => {
        const category = categories.find(
          (category) => category.name === element.category,
        );

        const product = new Products();
        product.name = element.name;
        product.description = element.description;
        product.price = element.price;
        product.imgUrl = element.imgUrl;
        product.stock = element.stock;
        product.category = category;

        await this.productsRepository
          .createQueryBuilder()
          .insert()
          .into(Products)
          .values(product)
          .execute();
      }));

      return 'Productos Agregados';
    } catch (error) {
      console.error('Error al agregar productos:', error);
      throw error;
    }
  }

  async updateProduct(id: string, product: Products) {
    await this.productsRepository.update(id, product);
    const updatedProduct = await this.productsRepository.findOneBy({
      id,
    });
    return updatedProduct;
  }
}
