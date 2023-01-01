import { Router } from "express";
const router = Router();
import * as QuestionsCtrl from "../controllers/question.controller.js";

router.get('/', QuestionsCtrl.getQuestions)
router.get('/all', QuestionsCtrl.getAllQuestions); // can use "limitSize" and "index" methods
router.post('/add', QuestionsCtrl.addQuestion);
router.patch('/markAsAnswered', QuestionsCtrl.markAsAnswered);
router.delete('/delete', QuestionsCtrl.deleteQuestionById);

export default router;