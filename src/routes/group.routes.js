import { Router } from "express";
const router = Router();
import * as groupsCtrl from "../controllers/group.controller.js";
import { authJwt, upload } from "../middlewares/index.js";

router.post('/create', [authJwt.verifyToken, upload.any()], groupsCtrl.createGroup);
router.get('/all', authJwt.verifyToken, groupsCtrl.getGroups);
router.get('/:groupId', authJwt.verifyToken, groupsCtrl.getGroupById);
router.get('/:name', authJwt.verifyToken, groupsCtrl.getGroupByName);
router.patch('/name', [authJwt.verifyToken, ], groupsCtrl.updateGroupNameById);
router.patch('/image', [authJwt.verifyToken, upload.any()], groupsCtrl.updateGroupImageById);
router.delete('/delete', [authJwt.verifyToken], groupsCtrl.deleteGroupById);

export default router;