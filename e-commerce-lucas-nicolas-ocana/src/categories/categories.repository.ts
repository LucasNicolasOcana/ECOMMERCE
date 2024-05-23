import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entities/category.entity";
import { Repository } from "typeorm";
import * as data from "../utils/data.json"

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  async getCategories() {
    return await this.categoriesRepository.find();
  }

  async addCategories() {
    for (const element of data) {
      const existingCategory = await this.categoriesRepository.findOne({ where: { name: element.category } });
  
      if (!existingCategory) {
        await this.categoriesRepository
          .createQueryBuilder()
          .insert()
          .into(Category)
          .values({ name: element.category })
          .execute();
      } else {
        return `Las categorías ya existen`;
      }
    }
  
    return 'Categorías Agregadas';
  }
  
  
}
