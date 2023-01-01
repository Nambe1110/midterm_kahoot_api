import Notification from "../models/Notification.js";

export const getAllNotifications = async (req, res) => {
    const notifications = await Notification.find();
    res.status(200).json({
        status: 'success',
        data: { 
            notifications
        }
    })
}

export const getNotifications = async (req, res) => {
    const userId = req.params.userId;
    const limitSize = req.query.limitSize ? parseInt(req.query.limitSize) : 0;
    const index = req.query.index ? parseInt(req.query.index) : 0;

    const notifications = await Notification.find({userId: userId}).limit(limitSize).skip(index);;
    res.status(200).json({
        status: 'success',
        data: { 
            notifications
        }
    })
}

export const addNotification = async (req, res) => {
    const {content, userId} = req.body;
    const newNotification = new Notification({content, userId});

    const NotificationSaved = await newNotification.save();
    res.status(200).json({
        status: 'success',
        data: { 
            NotificationSaved
        }
    })
}

export const markAsRead = async (req, res) => {
    const notification = await Notification.findById(req.body.notificationId);
    if(!notification) return res.status(404).json({ message: "Notification doesn't exist"});

    if(notification.isRead) return res.status(200).json({message: "This notification is already marked as read"});

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