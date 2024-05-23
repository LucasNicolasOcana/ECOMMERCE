import { Controller, Get, Query, Param, Put, Body, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Products } from "src/entities/products.entity";
import { Roles } from "src/decorators/role.decorators";
import { Role } from "src/users/roles.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/auth.roles.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  @Get()
  getProducts(
    @Query('page') page: string, @Query('limit') limit: string
  ) {
    if (!page || !limit) return this.productsService.getProducts(1, 5);
    return this.productsService.getProducts(Number(page), Number(limit));
  }

  @Get('seeder')
  getProductsSeeder() {
    return this.productsService.addProducts();
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateProduct(@Param('id') id: string, @Body() product: Products) {
    return this.productsService.updateProduct(id, product);
  }
}
