import { Repository } from 'typeorm';
import { AppDataSource } from '../../models/dataSource';
import { User } from './userEntity';

export class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource?: typeof AppDataSource) {
    this.repository = (dataSource || AppDataSource).getRepository(User);
  }

  async updateUser(user: User): Promise<User> {
    try {
      return await this.repository.save(user);
    } catch (error) {
      console.error('수정을 할 수 없습니다', error);
      throw new Error('Could not update user');
    }
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

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const emails = (await this.repository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne()) as User | undefined;
      return emails;
    } catch (error) {
      console.error('User를 찾을 수 없습니다:', error);
    }
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email_verification_token: token },
    });
  }
}
