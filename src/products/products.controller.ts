import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseUUIDPipe,
    Patch,
    Query, UploadedFiles, UseInterceptors, BadRequestException, UploadedFile,
} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import {CloudinaryService} from "../cloudinary/cloudinary.service";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {Public} from "../common/decorators/public.decorator";

@ApiBearerAuth()
@Roles('superadmin')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a product' })
    create(
        @Body() createProductDto: CreateProductDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.create(createProductDto, user);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all products' })
    findAll(@Query() pagination: PaginationDto) {
        return this.productsService.findAll(pagination);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get a product by ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProductDto: UpdateProductDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.update(id, updateProductDto, user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.remove(id, user);
    }

    @Post(':id/images')
    @ApiOperation({ summary: 'Upload up to 5 images for a product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
    @UseInterceptors(FilesInterceptor('files', 5))
    async uploadImages(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (!files || files.length === 0) throw new BadRequestException('No se enviaron imágenes');
        const urls = await Promise.all(files.map(f => this.cloudinaryService.uploadImage(f)));
        return this.productsService.addImages(id, urls);
    }

    @Post(':id/video')
    @ApiOperation({ summary: 'Upload a video for a product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
    @UseInterceptors(FileInterceptor('file'))
    async uploadVideo(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('No se envió el video');
        const url = await this.cloudinaryService.uploadVideo(file);
        return this.productsService.addVideo(id, url);
    }

    @Post(':id/gif')
    @ApiOperation({ summary: 'Upload a gif for a product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
    @UseInterceptors(FileInterceptor('file'))
    async uploadGif(
        @Param('id', ParseUUIDPipe) id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('No se envió el gif');
        const url = await this.cloudinaryService.uploadGif(file);
        return this.productsService.addGif(id, url);
    }
}