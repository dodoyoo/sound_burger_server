import { Request, Response, Router } from 'express';
import { UserController } from './userController';
import { UserRepository } from './userRepository';

const router = Router();
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

router.post('/api/sign-up', (req, res) => userController.signUp(req, res));

export default router;
