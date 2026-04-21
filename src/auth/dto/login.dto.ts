import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'haroldcorp' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  @MinLength(8)
  password: string;
}
