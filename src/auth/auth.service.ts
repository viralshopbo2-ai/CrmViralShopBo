import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.usersService.findOneByUsernameWithPassword(
      username.toLowerCase(),
    );

    if (!user || !user.active) {
      throw new UnauthorizedException('Invalid usr credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid psw credentials');
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role?.name,
    };

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role?.name,
      },
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
