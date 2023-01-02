import User from "../models/User.js";
import Token from "../models/Token.js";
import Group from "../models/Group.js";
import Notification from "../models/Notification.js";

export const getUsers = async (req, res) => {
    const Users = await User.find();
    res.status(200).json({
        status: 'success',
        data: { 
            Users
        }
    })
}

export const getMe = async (req, res) => {
    const me = await User.findById({ _id: req.userId});
    const groups = await Group.find();
    me.roles.owner = groups.filter(group => me.roles.owner.includes(group._id));
    me.roles.co_owner = groups.filter(group => me.roles.co_owner.includes(group._id));
    me.roles.member = groups.filter(group => me.roles.member.includes(group._id));

    const unreadNotifications = await Notification.find({userId: me._id, isRead: false})
    me.unread_count = unreadNotifications.length;
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                me,
                unread_count: unreadNotifications.length
            }
        }
    })
}

export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.userId);
    if(!user) return res.status(404).json({ message: "User doesn't exist"});
    const groups = await Group.find();
    user.roles.owner = groups.filter(group => user.roles.owner.includes(group._id));
    user.roles.co_owner = groups.filter(group => user.roles.co_owner.includes(group._id));
    user.roles.member = groups.filter(group => user.roles.member.includes(group._id));

    res.status(200).json({
        status: 'success',
        data: { 
            user
        }
    })
}

export const updateUserInfoById = async (req, res) => {
   
    const user = await User.findById(req.body.userId);
    if(!user) return res.status(404).json({ message: "User doesn't exist"});

    const updatedUser = await User.findByIdAndUpdate(req.body.userId, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        yearOfBirth: req.body.yearOfBirth,
        address: req.body.address
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedUser
        }
    })
}

export const updateAvatarById = async (req, res) => {
    const user = await User.findById(req.body.userId);
    if(!user) return res.status(404).json({ message: "User doesn't exist"});

    if (req.files[0].filename) {
        const newAvatar = req.files[0].filename;
        const updatedUser = await User.findByIdAndUpdate(req.body.userId, {avatar: newAvatar}, { new: true })
        res.status(200).json({
            status: 'success',
            data: { 
                updatedUser
            }
        })
    }
}

export const deleteUserById = async (req, res) => {
    const user = await User.findByIdAndDelete(req.body.userId);
    if(!user) return res.status(404).json({ message: "User doesn't exist"});
    res.status(200).json({
        status: 'success',
    });
}

export const activateAccountByToken = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("Invalid user");
    
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid token");
    
        await User.findByIdAndUpdate(user._id, {isActivated: true}, { new: true } );
        await Token.findByIdAndDelete(token._id);
    
        res.send("Email verified sucessfully");
    } catch (error) {
        res.status(400).send("An error occured");
        console.log(error);
    }
}

export const resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) return res.status(400).send("Invalid user");
    
        const token = await Token.findOne({
            userId: user._id,
            token: req.body.token,
            tokenType: "resetPassword"
        });
        if (!token) return res.status(400).send("Invalid token");

        // Token will expired in 60 minutes after created
        const onehour= 1000 * 60 * 60;
        if (Date.now() - token.createdAt > onehour) {
            await Token.findByIdAndDelete(token._id);
            return res.status(400).send("Token expired");
        }
    
        await User.findByIdAndUpdate(user._id, {
            password: await User.encryptPassword(req.body.password),
        }, { new: true } );
        await Token.findByIdAndDelete(token._id);
    
        res.send("Reset password successfully");
    } catch (error) {
        res.status(400).send("An error occured");
        console.log(error);
    }
}