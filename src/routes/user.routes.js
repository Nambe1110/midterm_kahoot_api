import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { authJwt, verifySignup } from '../middlewares/index.js';

const router = Router();



export default router;


