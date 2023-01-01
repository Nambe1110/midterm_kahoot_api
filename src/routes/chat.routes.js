import { Router } from "express";
const router = Router();
import * as ChatsCtrl from "../controllers/chat.controller.js";

router.get('/', ChatsCtrl.getChats)
router.get('/all', ChatsCtrl.getAllChats);
router.post('/add', ChatsCtrl.addChat);
router.delete('/delete', ChatsCtrl.deleteChatById);

export default router;