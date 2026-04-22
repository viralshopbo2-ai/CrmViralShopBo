// orders/orders.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {ApiBearerAuth} from "@nestjs/swagger";
import {Roles} from "../common/decorators/roles.decorator";
import {Public} from "../common/decorators/public.decorator";

@ApiBearerAuth()
@Roles('superadmin')
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

}