import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Orders } from 'src/entities/orders.entity';
import { OrderDetails } from 'src/entities/orders-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Products } from 'src/entities/products.entity';
import { OrdersRepository } from './orders.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
    TypeOrmModule.forFeature([OrderDetails]),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Products]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository]
})
export class OrdersModule {}
