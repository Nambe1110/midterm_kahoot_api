import Notification from "../models/Notification.js";
import Presentation from "../models/Presentation.js";
import User from "../models/User.js";

export const getAllNotifications = async (req, res) => {
    const notifications = await Notification.find().sort({createdAt:-1}) ;
    res.status(200).json({
        status: 'success',
        data: { 
            notifications
        }
    })
}

export const getNotifications = async (req, res) => {
    const userId = req.userId;
    const limitSize = req.query.limitSize ? parseInt(req.query.limitSize) : 0;
    const index = req.query.index ? parseInt(req.query.index) : 0;

    const notifications = await Notification.find({userId: userId}).limit(limitSize).skip(index).sort({createdAt:-1});
    res.status(200).json({
        status: 'success',
        data: { 
            notifications: notifications
        }
    })
}

export const addNotification = async (req, res) => {
    const {content, userId} = req.body;
    const newNotification = new Notification({content, userId});

    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message: "User doesn't exist"});

    const NotificationSaved = await newNotification.save();
    res.status(200).json({
        status: 'success',
        data: { 
            NotificationSaved
        }
    })
}

export const addManyNotifications = async (req, res) => {
    const {content, userIdList} = req.body;
    let NotificationsSaved = [];

    for (let i = 0; i < userIdList.length; i++) {
        const user = await User.findById(userIdList[i]);
        if(user) {
            const userId = userIdList[i];
            const newNotification = new Notification({content, userId});
            const notificationSaved = await newNotification.save();
            NotificationsSaved.push(notificationSaved);
        }
    }

    res.status(200).json({
        status: 'success',
        data: {
            NotificationsSaved
        }
    })
}

export const markAsRead = async (req, res) => {
    const notification = await Notification.findById(req.body.notificationId);
    if(!notification) return res.status(404).json({ message: "Notification doesn't exist"});

    if(notification.isRead) return res.status(403).json({message: "This notification is already marked as read"});

    const updatedNotification = await Notification.findByIdAndUpdate(req.body.notificationId, {
        isRead: true,
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedNotification
        }
    })
}

export const deleteNotificationById = async (req, res) => {
    const notification = await Notification.findByIdAndDelete(req.body.notificationId);
    if(!notification) return res.status(404).json({ message: "Notification doesn't exist"});
    res.status(200).json({
        status: 'success',
    });
}
