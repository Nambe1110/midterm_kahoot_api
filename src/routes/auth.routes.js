import { Router } from "express";
const router = Router();

import * as authCtrl from "../controllers/auth.controller.js";

router.post('/signup', authCtrl.signUp)
router.post('/signin', authCtrl.signIn)
router.post('/resetpassword', authCtrl.requestResetPassword)
router.post('/signin/google', authCtrl.googleSignIn)

export default router;