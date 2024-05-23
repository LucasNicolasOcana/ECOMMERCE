import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetails } from "src/entities/orders-details.entity";
import { Orders } from "src/entities/orders.entity";
import { Products } from "src/entities/products.entity";
import { Users } from "src/entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(Orders)
        private ordersRepository: Repository<Orders>,
        @InjectRepository(OrderDetails)
        private orderDetailsRepository: Repository<OrderDetails>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
    ) {}

    async addOrder(userId: string, products: Products[]) {
        let total = 0;
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            return `Usuario con id ${userId} no encontrado`;
        }
    
        const order = new Orders();
        order.date = new Date();
        order.user = user;
    
        const newOrder = await this.ordersRepository.save(order);
        const productsArray = await Promise.all(
            products.map(async (element) => {
                const product = await this.productsRepository.findOneBy({
                    id: element.id,
                });
                if (!product) {
                    return `Producto con id ${element.id} no encontrado`;
                }
                total += Number(product.price);
                await this.productsRepository.update(
                    { id: element.id },
                    { stock: product.stock - 1},
                );

                if (product.stock === 0) {
                        throw new BadRequestException ('Producto sin stock');
                }
    
                return product;
            }),
        );
    
        const validProducts = productsArray.filter(item => typeof item !== 'string') as Products[];
    
        const orderDetail = new OrderDetails();
        orderDetail.price = Number(Number(total).toFixed(2));
        orderDetail.products = validProducts;
        orderDetail.order = newOrder;
        await this.orderDetailsRepository.save(orderDetail);
    
        return await this.ordersRepository.find({
            where: { id: newOrder.id },
            relations: {
                orderDetails: true,
            },
        });
    }
    
    getOrder(id: string) {
        const order = this.ordersRepository.findOne({
            where: { id },
            relations: {
                orderDetails: {
                    products: true,
                },
            },
        });
        if (!order) {
            return 'Orden con id ${id} no encontrado';
        }

        return order;
    }

    async getAllOrder() {
        await this.ordersRepository.find({
            relations:['orderDetail'],
        });
    }
}


