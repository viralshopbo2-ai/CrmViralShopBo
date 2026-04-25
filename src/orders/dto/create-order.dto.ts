import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'Carlos' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Apala' })
  @IsString()
  apellido: string;

  @ApiProperty({ example: '70000000' })
  @IsString()
  telefono: string;

  @ApiProperty({ example: 'Av Siempre Viva' })
  @IsString()
  direccion: string;

  @ApiProperty({ example: '123' })
  @IsString()
  numero: string;

  @ApiProperty({ example: 'Santa Cruz' })
  @IsString()
  departamento: string;

  @ApiProperty({ example: 'Andrés Ibáñez', required: false })
  @IsOptional()
  provincia?: string;

  @ApiProperty({ example: 'Santa Cruz', required: false })
  @IsOptional()
  municipio?: string;

  @ApiProperty({ example: 'Casa azul con portón negro', required: false })
  @IsOptional()
  referencia?: string;

  @ApiProperty({
    example: [
      { producto: 'Pizza', cantidad: 2, precio: 50 },
      { producto: 'Refresco', cantidad: 1, precio: 10 }
    ],
  })
  @IsArray()
  @IsNotEmpty()
  items: any[];

  @ApiProperty({ example: 110 })
  @IsNumber()
  subtotal: number;

  @ApiProperty({ example: 110 })
  @IsNumber()
  total: number;
}