import { Router } from "express";
const router = Router();
import * as PresentationsCtrl from "../controllers/presentation.controller.js";

router.get('/all', PresentationsCtrl.getPresentations);
router.get('/:presentationId', PresentationsCtrl.getPresentationById);
router.post('/create', PresentationsCtrl.createPresentation);
router.patch('/changeName', PresentationsCtrl.updatePresentationNameById);
router.patch('/toPrivate', PresentationsCtrl.toPrivate);
router.patch('/toPublic', PresentationsCtrl.toPublic);
router.patch('/changeName', PresentationsCtrl.updatePresentationNameById);
router.patch('/changeAllSlides', PresentationsCtrl.updatePresentationNameById);
router.patch('/deleteAllSlides', PresentationsCtrl.updatePresentationNameById);
router.delete('/delete', PresentationsCtrl.deletePresentationById);

export default router;