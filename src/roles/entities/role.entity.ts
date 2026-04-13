import { Entity, Column, OneToMany } from 'typeorm';
import { BaseAuditEntity } from '../../common/database/base-entity';
import { User } from '../../users/entities/user.entity';

@Entity('roles')
export class Role extends BaseAuditEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
