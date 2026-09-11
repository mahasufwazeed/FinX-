import { Router } from 'express';
import { register, login, getMe, googleSignIn, getGoogleConfig, refreshToken, googleCallback } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleSignIn);
router.get('/google/config', getGoogleConfig);
router.get('/google/callback', googleCallback);
router.post('/refresh', refreshToken);

router.get('/me', authenticate, getMe);

export default router;
