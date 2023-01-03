import { Router } from "express";
const router = Router();
import * as PresentationsCtrl from "../controllers/presentation.controller.js";
import { authJwt } from "../middlewares/index.js";

// For both public and group presentation 
router.get('/total', PresentationsCtrl.getTotalPresentations); // get all presentations in db
router.get('/all', [authJwt.verifyToken], PresentationsCtrl.getAllPresentations); // get all presentation created by a user
router.get('/:presentationId', PresentationsCtrl.getPresentationById);
router.patch('/toPrivate', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.toPrivate);
router.patch('/toPublic', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.toPublic);
router.patch('/changeName',[authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.updatePresentationNameById);
router.patch('/changeAllSlides', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.changeAllSlides);
router.patch('/currentSlide', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.changeCurrentSlide);
router.patch('/deleteAllSlides', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.deleteAllSlides);
router.patch('/vote', [authJwt.verifyIfHaveToken], PresentationsCtrl.answerPublicSlideQuestion);
router.delete('/delete', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.deletePresentationById);

router.patch('/isPresenting', PresentationsCtrl.isPresenting); // Check whether a presentation is presenting
router.patch('/present', PresentationsCtrl.startPresent);
router.patch('/stopPresent', PresentationsCtrl.stopPresent);

// Public Presentation //
router.post('/create', [authJwt.verifyToken], PresentationsCtrl.createPublicPresentation);
router.patch('/addCollaborators', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.addCollaborators);
router.patch('/removeCollaborators', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.removeCollaborators);


// Group presentation //
router.post('/createPrivate', [authJwt.verifyToken], PresentationsCtrl.createPrivatePresentation);
router.patch('/isGroupPresenting', PresentationsCtrl.isGroupPresenting); // Check whether there is a presenting presentation in a group






export default router