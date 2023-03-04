import express from 'express';
import AuthController from '../controllers/AuthController';

const authController = new AuthController();
const router = express.Router();

router.get('/github');

export default router;
