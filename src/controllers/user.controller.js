import User from "../models/User.js";

export const getUsers = async (req, res) => {
    const Users = await User.find();
    res.status(200).json({
        status: 'success',
        data: { 
            Users
        }
    })
}

export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.userId);
    if(!user) return res.status(404).json({ message: "User doesn't exist"});

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

    const updatedUser = await User.findByIdAndUpdate(req.body.userId, req.body, { new: true })
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
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link");
    
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link");
    
        await User.updateOne({ _id: user._id, isActivated: true });
        await Token.findByIdAndRemove(token._id);
    
        res.send("email verified sucessfully");
    } catch (error) {
        res.status(400).send("An error occured");
    }
}