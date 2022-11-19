import { Router } from "express";
const router = Router();
import * as groupsCtrl from "../controllers/group.controller.js";
import { authJwt, upload } from "../middlewares/index.js";

router.post('/create', [authJwt.verifyToken, upload.any()], groupsCtrl.createGroup);
router.get('/all', authJwt.verifyToken, groupsCtrl.getGroups);
router.get('/:groupId',  groupsCtrl.getGroupById);
router.get('/:name', authJwt.verifyToken, groupsCtrl.getGroupByName);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin, upload.any()], groupsCtrl.updateGroupNameById);
router.post('/delete', [authJwt.verifyToken], groupsCtrl.deleteGroupById);

export default router;