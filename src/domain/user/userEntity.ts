import 'reflect-metadata';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nickname!: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  profile_image!: string;

  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  is_verified: boolean = false;

  @Column({ type: 'varchar', length: 500, nullable: false })
  email_verification_token!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;
}
