import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'superadmin' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Harolito123' })
  @IsString()
  @MinLength(8)
  password: string;
}
