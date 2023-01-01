import { Router } from "express";
const router = Router();
import * as ChatsCtrl from "../controllers/chat.controller.js";

router.get('/:presentationId', ChatsCtrl.getChats) // get chats of a presentation
router.get('/all', ChatsCtrl.getAllChats); // get all chats in database
router.post('/add', ChatsCtrl.addChat);
router.delete('/delete', ChatsCtrl.deleteChatById);

export default router;