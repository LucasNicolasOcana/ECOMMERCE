import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Users } from './users.entity';
import { OrderDetails } from './orders-details.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'ORDERS'
})
export class Orders {
  @ApiProperty({
    description: 'uuid v4 generado por BBDD',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Debe ser una fecha del tipo dd/mm/yyyy',
    example: '27/04/1998'
  })
  @Column()
  date: Date;

  @ApiHideProperty()
  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails;

  @ApiHideProperty()
  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'user_id'})
  user: Users;
}