import { Router } from "express";
const router = Router();
import * as usersCtrl from "../controllers/user.controller.js";
import { authJwt, upload } from "../middlewares/index.js";

router.get('/all', [authJwt.verifyToken, authJwt.isAdmin], usersCtrl.getUsers);
router.get('/:userId', authJwt.verifyToken, usersCtrl.getUserById);
router.put('/updateInfo', [authJwt.verifyToken, ], usersCtrl.updateUserInfoById);
router.patch('/avatar', [authJwt.verifyToken, upload.any()], usersCtrl.updateAvatarById);
router.delete('/delete', [authJwt.verifyToken, authJwt.isAdmin], usersCtrl.deleteUserById);

export default router;