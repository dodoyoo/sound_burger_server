import { Request, Response, Router } from 'express';
import { UserController } from './userController';
import { UserRepository } from './userRepository';

const router = Router();
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

// router.post('/api/sign-up', (req, res) => userController.signUp(req, res));

// router.post('/api/sign-in', (req, res) => userController.signIn(req, res));

// router.get('/api/verify', (req, res) => userController.verifyEmail(req, res));

router.get('/api/spotify/top100', (req, res) =>
  userController.getTop100(req, res)
);

export default router;
