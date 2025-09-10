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

const comparePassword = async (
  inputPassword: string,
  storedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(inputPassword, storedPassword);
};

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
        email_verification_token: verification_token,
      });
      await sendVerificationEmail(email, verification_token);
      res
        .status(201)
        .json({ message: '회원가입 성공, 이메일 인증을 완료해주세요' });
    } catch (err: unknown) {
      return reportErrorMessage(err, res);
    }
  }

  // 이메일 인증
  public async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token) {
        return new PropertyRequiredError('토큰이 필요합니다.');
      }

      const user = await this.userRepository.findByVerificationToken(
        token as string
      );
      if (!user) {
        return new InvalidPropertyError('유효하지 않은 토큰입니다.');
      }

      if (user.is_verified) {
        return new InvalidPropertyError('이미 인증된 계정입니다.');
      }

      user.is_verified = true;
      user.email_verification_token = null;
      await this.userRepository.updateUser(user);

      res.redirect(`http://localhost:3000/verifiedEmail=${user.email}`);
    } catch (err: unknown) {
      return reportErrorMessage(err, res);
    }
  }

  public async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!emailRegex.test(email)) {
        throw new InvalidPropertyError('잘못된 이메일 형식입니다.');
      }

      const user: User | undefined = await this.userRepository.findByEmail(
        email
      );
      if (!user) {
        throw new InvalidPropertyError('존재하지 않는 사용자입니다.');
      }

      if (!user.is_verified) {
        throw new InvalidPropertyError(
          '이메일 인증이 필요합니다. 인증 후 다시 로그인해주세요.'
        );
      }

      const isPasswordValid: boolean = await comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new InvalidPropertyError('비밀번호가 일치하지 않습니다.');
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET_KEY!,
        {
          expiresIn: '7d',
        }
      );
      console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

      res.status(200).json({
        message: '로그인 성공',
        user: {
          token,
          email: user.email,
          nickname: user.nickname,
          profileImage: user.profile_image,
        },
      });
    } catch (err: unknown) {
      return reportErrorMessage(err, res);
    }
  }
}
