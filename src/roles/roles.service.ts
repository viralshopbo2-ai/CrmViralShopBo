import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: JwtPayload): Promise<Role> {
    const nameLower = createRoleDto.name.toLowerCase();

    const existingRole = await this.roleRepo.findOne({
      where: { name: nameLower },
    });
    if (existingRole) {
      throw new ConflictException(
        `El rol con el nombre "${createRoleDto.name}" ya existe`,
      );
    }

    const role = this.roleRepo.create({
      ...createRoleDto,
      name: nameLower,
      createdBy: user.username,
    });

    return await this.roleRepo.save(role);
  }

  async findAll(pagination: PaginationDto): Promise<{ data: Role[]; total: number; page: number; size: number }> {
    const { page = 1, size = 10 } = pagination;
    const skip = (page - 1) * size;

    const [data, total] = await this.roleRepo.findAndCount({
      take: size,
      skip,
    });

    return { data, total, page, size };
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto,user: JwtPayload): Promise<Role> {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('Rol no encontrado');

    if (updateRoleDto.name) {
      const nameLower = updateRoleDto.name.toLowerCase();

      const existingRole = await this.roleRepo.findOne({
        where: { name: nameLower },
      });
      if (existingRole && existingRole.id !== id) {
        throw new ConflictException(
          `El nombre de rol "${updateRoleDto.name}" ya está en uso`,
        );
      }

      updateRoleDto.name = nameLower;
    }

    const updatedRole = this.roleRepo.merge(role, updateRoleDto);
    updatedRole.updatedBy = user.username;
    return await this.roleRepo.save(updatedRole);
  }

  async remove(id: string, user:JwtPayload): Promise<Role> {
    const role = await this.findOne(id);
    role.deletedBy = user.username;
    return await this.roleRepo.softRemove(role);
  }
}
