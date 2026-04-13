import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'NombreDeEjemplo',
  })
  @IsString()
  @MinLength(3)
  name: string;
}
