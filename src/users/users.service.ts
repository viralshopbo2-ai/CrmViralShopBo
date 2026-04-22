import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../roles/entities/role.entity';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto, user: JwtPayload): Promise<User> {
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

    const userEntity = this.userRepo.create({
      ...userData,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      dni,
      password: hashedPassword,
      role: { id: dto.roleId } as Role,
      createdBy: user.username,
    });

    return await this.userRepo.save(userEntity);
  }

  async findAll(pagination: PaginationDto): Promise<{ data: User[]; total: number; page: number; size: number }> {
    const { page = 1, size = 10 } = pagination;
    const skip = (page - 1) * size;

    const [data, total] = await this.userRepo.findAndCount({
      relations: ['role'],
      take: size,
      skip,
    });

    return { data, total, page, size };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }



  async update(id: string, updateUserDto: UpdateUserDto, user: JwtPayload): Promise<User> {
    const userEntity = await this.findOne(id);
    const { username, email, dni, password, roleId, ...rest } = updateUserDto;

    const whereConditions: FindOptionsWhere<User>[] = [];
    if (username) whereConditions.push({ username: username.toLowerCase() });
    if (email)    whereConditions.push({ email: email.toLowerCase() });
    if (dni)      whereConditions.push({ dni });

    if (whereConditions.length > 0) {
      const existingUser = await this.userRepo.findOne({ where: whereConditions });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El username, email o DNI ya están en uso');
      }
    }

    if (password) rest['password'] = await bcrypt.hash(password, 10);
    if (username) rest['username'] = username.toLowerCase();
    if (email)    rest['email']    = email.toLowerCase();
    if (dni)      rest['dni']      = dni;
    if (roleId)   userEntity.role  = { id: roleId } as Role;

    const updatedUser = this.userRepo.merge(userEntity, rest);
    updatedUser.updatedBy = user.username;
    return await this.userRepo.save(updatedUser);
  }

  async remove(id: string, user: JwtPayload): Promise<User> {
    const userEntity = await this.findOne(id);
    userEntity.deletedBy = user.username;
    await this.userRepo.save(userEntity);
    return await this.userRepo.softRemove(userEntity);
  }

  async findOneByUsernameWithPassword(username: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username: username.toLowerCase() },
      select: ['id', 'username', 'password', 'email'],
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