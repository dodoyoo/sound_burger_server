import { Repository } from 'typeorm';
import { AppDataSource } from '../../models/dataSource';
import { User } from './userEntity';

export class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource?: typeof AppDataSource) {
    this.repository = (dataSource || AppDataSource).getRepository(User);
  }

  // 유저 회원가입
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = this.repository.create(userData);
      return await this.repository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Could not create user');
    }
  }
}
