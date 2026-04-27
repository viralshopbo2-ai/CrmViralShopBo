import { Entity, Column } from 'typeorm';
import { BaseAuditEntity } from '../../common/database/base-entity';

@Entity('products')
export class Product extends BaseAuditEntity {
    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('text')
    description: string;

    @Column({ default: 0 })
    stock: number;

    @Column('decimal', { precision: 2, scale: 1, default: 0 })
    stars: number;

    @Column({ default: 0 })
    reviews: number;

    @Column({ type: 'json', nullable: true })
    specifications: { key: string; value: string }[];

    @Column({ type: 'json', nullable: true })
    characteristics: string[];

    @Column({ type: 'json', nullable: true })
    comments: { author: string; text: string; stars: number }[];

    @Column({ type: 'json', nullable: true })
    frequentlyQuestions: { question: string; answer: string }[];

    @Column('simple-array', { nullable: true })
    images: string[];

    @Column({ nullable: true })
    video: string;

    @Column({ nullable: true })
    gif: string;
}