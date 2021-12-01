import { Router, response } from 'express';
import UserController from './controller/UserController';


const router = Router();
router.post('/signup/local',UserController.signUp);
router.post('/signup/google',UserController.signUpWithGoogle);
router.post('/signin/local',UserController.signIn);
router.post('/signin/google',UserController.signInWithGoogle);

export default router; 