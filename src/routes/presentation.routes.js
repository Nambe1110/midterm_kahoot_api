import { Router } from "express";
const router = Router();
import * as PresentationsCtrl from "../controllers/presentation.controller.js";
import { authJwt } from "../middlewares/index.js";

router.get('/all', PresentationsCtrl.getPresentations);
router.get('/:presentationId', PresentationsCtrl.getPresentationById);
router.post('/create', [authJwt.verifyToken], PresentationsCtrl.createPresentation);
router.patch('/toPrivate', PresentationsCtrl.toPrivate);
router.patch('/toPublic', PresentationsCtrl.toPublic);
router.patch('/changeName', PresentationsCtrl.updatePresentationNameById);
router.patch('/changeAllSlides', PresentationsCtrl.changeAllSlides);
router.patch('/currentSlide', PresentationsCtrl.changeCurrentSlide);
router.patch('/deleteAllSlides', PresentationsCtrl.deleteAllSlides);
router.patch('/vote', [authJwt.verifyIfHaveToken], PresentationsCtrl.answerSlideQuestion);
router.delete('/delete', PresentationsCtrl.deletePresentationById);

export default router;