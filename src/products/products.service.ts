import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) {}

    async create(createProductDto: CreateProductDto, user: JwtPayload): Promise<Product> {
        const product = this.productRepo.create({
            ...createProductDto,
            createdBy: user.username,
        });
        return await this.productRepo.save(product);
    }

    async findAll(pagination: PaginationDto): Promise<{ data: Product[]; total: number; page: number; size: number }> {
        const { page = 1, size = 10 } = pagination;
        const skip = (page - 1) * size;

        const [data, total] = await this.productRepo.findAndCount({
            take: size,
            skip,
        });

        return { data, total, page, size };
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepo.findOneBy({ id });
        if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto, user: JwtPayload): Promise<Product> {
        const product = await this.findOne(id);

        const mediaFields = new Set(['images', 'video', 'gif']);

        // Strip undefined; also strip null for media fields (json column quirk in TypeORM/MySQL)
        const cleanDto = Object.fromEntries(
            Object.entries(updateProductDto).filter(([k, v]) =>
                v !== undefined && !(mediaFields.has(k) && v === null),
            ),
        );

        const updatedProduct = this.productRepo.merge(product, cleanDto);
        updatedProduct.updatedBy = user.username;
        return await this.productRepo.save(updatedProduct);
    }

    async remove(id: string, user: JwtPayload): Promise<Product> {
        const product = await this.findOne(id);
        product.deletedBy = user.username;
        await this.productRepo.save(product);
        return await this.productRepo.softRemove(product);
    }

    async addImages(id: string, urls: string[]): Promise<Product> {
        const product = await this.findOne(id);
        product.images = [...(product.images ?? []), ...urls].slice(0, 5);
        return await this.productRepo.save(product);
    }

    async addVideo(id: string, url: string): Promise<Product> {
        const product = await this.findOne(id);
        product.video = url;
        return await this.productRepo.save(product);
    }

    async addGif(id: string, url: string): Promise<Product> {
        const product = await this.findOne(id);
        product.gif = url;
        return await this.productRepo.save(product);
    }
}