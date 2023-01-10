import { Router } from "express";
const router = Router();
import * as notificationsCtrl from "../controllers/notification.controller.js";
import { authJwt } from "../middlewares/index.js";

router.get('/',  [authJwt.verifyToken], notificationsCtrl.getNotifications) // get notifications of a user 
router.get('/all', notificationsCtrl.getAllNotifications); // get all notifications in database
router.post('/add', notificationsCtrl.addNotification);
router.post('/addMany', notificationsCtrl.addManyNotifications);
router.patch('/markAsRead', notificationsCtrl.markAsRead);
router.delete('/delete', notificationsCtrl.deleteNotificationById);

export default router;