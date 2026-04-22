import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsOptional,
    IsArray,
    IsPositive,
    Min,
    MaxLength,
    ValidateNested,
    ArrayMaxSize,
    IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

class SpecificationDto {
    @IsString()
    key: string;

    @IsString()
    value: string;
}

class CommentDto {
    @IsString()
    author: string;

    @IsString()
    text: string;

    @IsNumber()
    @Min(1)
    stars: number;
}

class FrequentlyQuestionDto {
    @IsString()
    question: string;

    @IsString()
    answer: string;
}

export class CreateProductDto {
    @ApiProperty({ example: 'Masajeador Muscular de Percusión Pro' })
    @IsString()
    name: string;

    @ApiProperty({ example: 259.00 })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({ example: 'Masajeador profesional de alto rendimiento...' })
    @IsString()
    @MaxLength(1000)
    description: string;

    @ApiProperty({ example: 30 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: 4.9, required: false })
    @IsOptional()
    @IsNumber()
    stars?: number;

    @ApiProperty({ example: 125, required: false })
    @IsOptional()
    @IsNumber()
    reviews?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SpecificationDto)
    specifications?: { key: string; value: string }[];

    @ApiProperty({ example: ['Motor silencioso', 'Diseño ergonómico'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    characteristics?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CommentDto)
    comments?: { author: string; text: string; stars: number }[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FrequentlyQuestionDto)
    frequentlyQuestions?: { question: string; answer: string }[];

    @ApiProperty({ example: ['https://res.cloudinary.com/...'], required: false })
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    @ArrayMaxSize(5)
    images?: string[];

    @ApiProperty({ example: 'https://res.cloudinary.com/...', required: false })
    @IsOptional()
    @IsUrl()
    video?: string;

    @ApiProperty({ example: 'https://res.cloudinary.com/...', required: false })
    @IsOptional()
    @IsUrl()
    gif?: string;
}