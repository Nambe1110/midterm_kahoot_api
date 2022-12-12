import { Router } from "express";
const router = Router();
import * as PresentationsCtrl from "../controllers/presentation.controller.js";
import { authJwt } from "../middlewares/index.js";

router.get('/all', PresentationsCtrl.getPresentations);
router.get('/:presentationId', PresentationsCtrl.getPresentationById);
router.post('/create', [authJwt.verifyToken], PresentationsCtrl.createPresentation);
router.patch('/toPrivate', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.toPrivate);
router.patch('/toPublic', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.toPublic);
router.patch('/changeName',[authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.updatePresentationNameById);
router.patch('/changeAllSlides', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.changeAllSlides);
router.patch('/currentSlide', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.changeCurrentSlide);
router.patch('/deleteAllSlides', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.deleteAllSlides);
router.patch('/vote', [authJwt.verifyIfHaveToken], PresentationsCtrl.answerSlideQuestion);
router.delete('/delete', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.deletePresentationById);

export default router;