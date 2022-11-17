import { Router } from "express";
const router = Router();

import * as groupsCtrl from "../controllers/group.controller.js";
import { authJwt } from "../middlewares/index.js";

router.post('/create', groupsCtrl.createGroup);
router.get('/all', groupsCtrl.getAllGroups);
router.get('/:groupId', groupsCtrl.getGroupById);
router.get('/:name', groupsCtrl.getGroupByName);
router.put('/:groupId', [authJwt.verifyToken, authJwt.isAdmin], groupsCtrl.updateGroupById);
router.delete('/:groupId', [authJwt.verifyToken, authJwt.isAdmin], groupsCtrl.deleteGroupById);

export default router;