import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'haroldcorp' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  password: string;
}
