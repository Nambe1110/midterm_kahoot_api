import { Router } from "express";
const router = Router();
import * as QuestionsCtrl from "../controllers/question.controller.js";

router.get('/:presentationId', QuestionsCtrl.getQuestions) // get questions of a presentation
router.get('/all', QuestionsCtrl.getAllQuestions); // get all questions in database
router.post('/add', QuestionsCtrl.addQuestion);
router.patch('/markAsAnswered', QuestionsCtrl.markAsAnswered);
router.delete('/delete', QuestionsCtrl.deleteQuestionById);

export default router;