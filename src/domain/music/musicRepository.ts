import { Repository } from 'typeorm';
import { AppDataSource } from '../../models/dataSource';
import { Music } from './musicEntity';

export class MusicRepository {
  private repository: Repository<Music>;

  constructor(dataSource?: typeof AppDataSource) {
    this.repository = (dataSource || AppDataSource).getRepository(Music);
  }
}
