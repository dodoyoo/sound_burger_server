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

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  spotifyId!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nickname!: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  profile_image!: string;

  @Column({ type: 'text', nullable: true })
  spotifyAccessToken!: string | null;

  @Column({ type: 'text', nullable: true })
  spotifyRefreshToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  spotifyTokenExpiresAt!: Date | null;

  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  is_verified: boolean = false;

  @Column({ type: 'varchar', length: 500, nullable: true })
  email_verification_token!: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;
}
