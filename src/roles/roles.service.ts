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

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
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
    });

    return await this.roleRepo.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepo.find({ where: { active: true } });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
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
    return await this.roleRepo.save(updatedRole);
  }

  async remove(id: string): Promise<Role> {
    const role = await this.findOne(id);
    role.active = false;
    return await this.roleRepo.softRemove(role);
  }
}
