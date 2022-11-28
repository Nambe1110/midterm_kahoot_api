import { Router } from "express";
const router = Router();
import * as groupsCtrl from "../controllers/group.controller.js";
import { authJwt, upload } from "../middlewares/index.js";

router.post('/create', [authJwt.verifyToken], groupsCtrl.createGroup);
router.get('/all', [authJwt.verifyToken, authJwt.isAdmin], groupsCtrl.getGroups);
router.get('/:groupId', authJwt.verifyToken, groupsCtrl.getGroupById);
router.get('/join/:groupId', [authJwt.verifyToken], groupsCtrl.addMemberViaLink);
router.patch('/name', [authJwt.verifyToken, authJwt.isOwnerOfGroup ], groupsCtrl.updateGroupNameById);
router.patch('/image', [authJwt.verifyToken, authJwt.isOwnerOfGroup, upload.any()], groupsCtrl.updateGroupImageById);
router.patch('/co_owner/add', [authJwt.verifyToken, authJwt.isOwnerOfGroup], groupsCtrl.addCoOwner);
router.patch('/co_owner/toMember', [authJwt.verifyToken, authJwt.isOwnerOfGroup], groupsCtrl.toMember);
router.patch('/co_owner/remove', [authJwt.verifyToken, authJwt.isOwnerOfGroup], groupsCtrl.removeCoOwner);
router.patch('/member/add', [authJwt.verifyToken, authJwt.isOwnerOrCoOwner], groupsCtrl.addMemeber);
router.patch('/member/toCoowner', [authJwt.verifyToken, authJwt.isOwnerOfGroup], groupsCtrl.toCoOwner);
router.patch('/member/remove', [authJwt.verifyToken, authJwt.isOwnerOrCoOwner], groupsCtrl.removeMemeber);
router.delete('/delete', [authJwt.verifyToken, authJwt.isOwnerOfGroup], groupsCtrl.deleteGroupById);

export default router;