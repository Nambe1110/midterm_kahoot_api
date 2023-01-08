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
router.patch('/deleteAllSlides', [authJwt.verifyToken, authJwt.isOwnerOfPresentation], PresentationsCtrl.deleteAllSlides);
router.delete('/delete', [authJwt.verifyToken], PresentationsCtrl.deletePresentationById);
router.get('/group/:groupId',[authJwt.verifyToken], PresentationsCtrl.getPresentationsOfGroup);
router.get('/isPresenting/:presentationId', [authJwt.verifyToken], PresentationsCtrl.isPresenting); // Check whether a presentation is presenting
router.patch('/present', [authJwt.verifyToken], PresentationsCtrl.startPresent);
router.patch('/stopPresent', [authJwt.verifyToken], PresentationsCtrl.stopPresent);
router.patch('/changeAllSlides', [authJwt.verifyToken], PresentationsCtrl.changeAllSlides);
router.patch('/currentSlide', [authJwt.verifyToken, ], PresentationsCtrl.changeCurrentSlide);
router.patch('/vote', [authJwt.verifyIfHaveToken], PresentationsCtrl.answerSlideQuestion);

// Public Presentation //
router.post('/create', [authJwt.verifyToken], PresentationsCtrl.createPublicPresentation);
router.patch('/addCollaborators', [authJwt.verifyToken], PresentationsCtrl.addCollaborators);
router.patch('/removeCollaborators', [authJwt.verifyToken], PresentationsCtrl.removeCollaborators); // *
router.get('/collaborators/:presentationId', [authJwt.verifyToken], PresentationsCtrl.getCollaboratorsOfPresentation); // *

// Group presentation //
router.post('/createPrivate', [authJwt.verifyToken], PresentationsCtrl.createPrivatePresentation);
router.get('/isGroupPresenting/:groupId', [authJwt.verifyToken], PresentationsCtrl.isGroupPresenting); // Check whether there is a presenting presentation in a group
router.get('/slideAnswers/:presentationId/:slideId', [authJwt.verifyToken], PresentationsCtrl.listAnswersOfSlide); // *





export default router