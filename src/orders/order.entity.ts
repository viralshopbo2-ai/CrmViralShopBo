// orders/order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Cliente
  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  telefono: string;

  // Dirección
  @Column()
  direccion: string;

  @Column()
  numero: string;

  @Column()
  departamento: string;

  @Column({ nullable: true })
  provincia?: string;

  @Column({ nullable: true })
  municipio?: string;

  @Column({ nullable: true })
  referencia?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Pedido (JSON)
  @Column({ type: 'json' })
  items: any;

  @Column('decimal')
  subtotal: number;

  @Column('decimal')
  total: number;
}