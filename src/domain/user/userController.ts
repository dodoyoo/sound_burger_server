import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  InvalidPropertyError,
  PropertyRequiredError,
} from '../../utils/customError';
import { sendVerificationEmail } from '../../utils/emailConfirm';
import { UserRepository } from './userRepository';
import { User } from './userEntity';
import { reportErrorMessage } from '../../utils/errorHandling';

const emailRegex =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-z\d!@#$%^&*(),.?":{}|<>]{10,}$/;

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export class UserController {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // 유저 회원가입
  public async signUp(req: Request, res: Response) {
    try {
      const { email, password, nickname, profile_image } = req.body;
      if (!emailRegex.test(email)) {
        throw new InvalidPropertyError('사용할 수 없는 이메일입니다.');
      }

      if (!passwordRegex.test(password)) {
        throw new InvalidPropertyError('사용할 수 없는 비밀번호 입니다.');
      }
      const hashedPassword: string = await hashPassword(password);

      const verification_token = crypto.randomBytes(32).toString('hex');
      await this.userRepository.createUser({
        email,
        password: hashedPassword,
        nickname,
        profile_image,
        is_verified: false,
      });
      await sendVerificationEmail(email, verification_token);
      res.status(201).json({ message: '회원가입 성공' });
    } catch (err: unknown) {
      return reportErrorMessage(err, res);
    }
  }

  public async verifyEmail(req: Request, res: Response) {
    const { token } = req.query;

    if (!token) {
      return new PropertyRequiredError('토큰이 필요합니다.');
    }

    const user = await this.userRepository.findByVerification_token(
      token as string
    );
    if (!user) {
      return new InvalidPropertyError('유효하지 않은 토큰입니다.');
    }

    user.is_verified = true;
    user.email_verification_token = null;
    await this.userRepository.updateUser(user);

    res.redirect(
      `http://localhost:3000/signUp.html?verifiedEmail=${user.email}`
    );
    res.status(200).json({ message: '이메일 인증 완료' });
  }
}
