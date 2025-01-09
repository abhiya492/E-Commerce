import express from 'express';
import { login, logout, signup ,refreshToken , getProfile, verifyOtp } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login',login );
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get("/profile",protectRoute, getProfile);
router.post('/verify-otp', verifyOtp);

export default router;
