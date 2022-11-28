import { Router } from "express";
const router = Router();
import * as groupsCtrl from "../controllers/group.controller.js";
import { authJwt, upload } from "../middlewares/index.js";

router.post('/create', [authJwt.verifyToken], groupsCtrl.createGroup);
router.get('/all', authJwt.verifyToken, groupsCtrl.getGroups);
router.get('/:groupId', authJwt.verifyToken, groupsCtrl.getGroupById);
router.patch('/name', [authJwt.verifyToken, ], groupsCtrl.updateGroupNameById);
router.patch('/image', [authJwt.verifyToken, upload.any()], groupsCtrl.updateGroupImageById);
router.patch('/co_owner/add', [authJwt.verifyToken, ], groupsCtrl.addCoOwner);
router.patch('/co_owner/toMember', [authJwt.verifyToken, ], groupsCtrl.toMember);
router.patch('/co_owner/remove', [authJwt.verifyToken, ], groupsCtrl.removeCoOwner);
router.patch('/member/add', [authJwt.verifyToken, ], groupsCtrl.addMemeber);
router.patch('/member/toCoowner', [authJwt.verifyToken, ], groupsCtrl.toCoOwner);
router.patch('/member/remove', [authJwt.verifyToken, ], groupsCtrl.removeMemeber);
router.delete('/delete', [authJwt.verifyToken], groupsCtrl.deleteGroupById);

export default router;