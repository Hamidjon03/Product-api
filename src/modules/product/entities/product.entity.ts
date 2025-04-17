// src/modules/product/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 255})
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({type: 'varchar', length: 255, name: 'image_url'})
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0, type: 'int', name: 'view_count' })
  viewCount: number;

  @Column({ default: 0, type: 'int', name: 'like_count' })
  likeCount: number;

  @Column({ default: 0, type: 'int', name: 'share_count' })
  shareCount: number;

  @CreateDateColumn({type: 'timestamp', name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamp', name: 'updated_at'})
  updatedAt: Date;
}
