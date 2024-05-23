import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './orders.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) {}

    @ApiBearerAuth()
    @Post()
    addOrder(@Body() order: CreateOrderDTO) {
        const { userId, products } = order;
        return this.orderService.addOrder(userId, products);
    }

    @ApiBearerAuth()
    @Get(':id')
    getOrder(@Param('id') id: string) {
        return this.orderService.getOrder(id);
    }

    @ApiBearerAuth()
    @Get()
    getAllOrder() {
        return this.orderService.getAllOrder();
    } 
}
