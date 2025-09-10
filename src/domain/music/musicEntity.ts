import 'reflect-metadata';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('musics')
export class Music {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  spotify_id!: string;

  @Column({ type: 'int', nullable: false })
  artist_id!: number;

  @Column({ type: 'int', nullable: false })
  category_id!: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title!: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  album_name!: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  album_image!: string;

  @Column({ type: 'int', nullable: false })
  duration_ms!: number;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  preview_url!: string;

  @Column({ type: 'date' })
  release_date!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
