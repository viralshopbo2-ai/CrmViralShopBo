import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { username, email, dni, password, ...userData } = dto;

    const existingUser = await this.userRepo.findOne({
      where: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() },
        { dni: dni },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username, Email or DNI already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      ...userData,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      dni,
      password: hashedPassword,
      role: { id: dto.roleId } as Role,
    });

    return await this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find({
      where: { active: true },
      relations: ['role'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async updateOld(id: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }
    if (updateDto.roleId) {
      user.role = { id: updateDto.roleId } as Role;
    }

    const updatedUser = this.userRepo.merge(user, updateDto);

    return await this.userRepo.save(updatedUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const { username, email, dni, password, roleId } = updateUserDto;
    if (username || email || dni) {
      const existingUser = await this.userRepo.findOne({
        where: [
          { username: username?.toLowerCase() },
          { email: email?.toLowerCase() },
          { dni: dni },
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El username, email o DNI ya están en uso');
      }
    }

    if (password) {
      updateUserDto.password = await bcrypt.hash(password, 10);
    }

    if (updateUserDto.username)
      updateUserDto.username = updateUserDto.username.toLowerCase();
    if (updateUserDto.email)
      updateUserDto.email = updateUserDto.email.toLowerCase();

    if (roleId) {
      user.role = { id: roleId } as Role;
    }

    const updatedUser = this.userRepo.merge(user, updateUserDto);
    return await this.userRepo.save(updatedUser);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    return await this.userRepo.softRemove(user);
  }

  async findOneByUsernameWithPassword(username: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username: username.toLowerCase() },
      select: ['id', 'username', 'password', 'email', 'active'],
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con username ${username} no encontrado`,
      );
    }

    return user;
  }
}