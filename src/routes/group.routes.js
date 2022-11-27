import { Router } from "express";
const router = Router();
import * as groupsCtrl from "../controllers/group.controller.js";
import { authJwt, upload } from "../middlewares/index.js";

router.post('/create', [authJwt.verifyToken], groupsCtrl.createGroup);
router.get('/all', authJwt.verifyToken, groupsCtrl.getGroups);
router.get('/:groupId', authJwt.verifyToken, groupsCtrl.getGroupById);
router.patch('/name', [authJwt.verifyToken, ], groupsCtrl.updateGroupNameById);
router.patch('/image', [authJwt.verifyToken, upload.any()], groupsCtrl.updateGroupImageById);
router.patch('/co_owner/add', [authJwt.verifyToken, ], groupsCtrl.addCoOwners);
router.patch('/co_owner/toMemeber', [authJwt.verifyToken, ], groupsCtrl.toMember);
router.patch('/co_owner/remove', [authJwt.verifyToken, ], groupsCtrl.removeCoOwners);
router.patch('/memeber/add', [authJwt.verifyToken, ], groupsCtrl.addMemebers);
router.patch('/memeber/toCoowner', [authJwt.verifyToken, ], groupsCtrl.toCoOwner);
router.patch('/memeber/remove', [authJwt.verifyToken, ], groupsCtrl.removeMemebers);
router.delete('/delete', [authJwt.verifyToken], groupsCtrl.deleteGroupById);

export default router;