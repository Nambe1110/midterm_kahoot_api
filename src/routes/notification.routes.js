import { Router } from "express";
const router = Router();
import * as notificationsCtrl from "../controllers/notification.controller.js";
import { authJwt, upload } from "../middlewares/index.js";

router.get('/', notificationsCtrl.getNotifications)
router.get('/all', notificationsCtrl.getAllNotifications);
router.post('/add', notificationsCtrl.addNotification);
router.patch('/markAsRead', notificationsCtrl.markAsRead);
router.delete('/delete', notificationsCtrl.deleteNotificationById);

export default router;