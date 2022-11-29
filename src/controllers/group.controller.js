import Group from "../models/Group.js";
import User from "../models/User.js";
import { Email } from "../modules/Email.js";

export const createGroup = async (req, res) => {
    const {name} = req.body;
    const owner_id = req.userId;
    const newGroup = new Group({name, owner_id});
    // if (req.files[0].filename) {
    //     newGroup.image = req.files[0].filename;
    // }

    const alredyGroupExist = await Group.findOne({ name: newGroup.name});
    if(alredyGroupExist) return res.status(400).json({ message: "Group already exists"});

    const groupSaved = await newGroup.save();
    res.status(200).json({
        status: 'success',
        data: { 
            groupSaved
        }
    })

    const user = await User.findById(req.userId);
    const roleOfUser = user.roles;
    roleOfUser.owner.push(groupSaved._id);
    const updatedUser = await User.findByIdAndUpdate(req.userId,{roles: roleOfUser}, { new: true })
}

export const getGroups = async (req, res) => {
    const groups = await Group.find();
    res.status(200).json({
        status: 'success',
        data: { 
            groups
        }
    })
}

export const getGroupById = async (req, res) => {
    const group = await Group.findById(req.params.groupId);
    if(!group) return res.status(404).json({ message: "Group doesn't exist"});

    res.status(200).json({
        status: 'success',
        data: { 
            group
        }
    })
}

export const updateGroupNameById = async (req, res) => {
    const {name} = req.body;

    const group = await Group.findById(req.body.groupId);
    if(!group) return res.status(404).json({ message: "Group doesn't exist"});

    const alredyGroupExist = await Group.findOne({ name: name});
    if(alredyGroupExist) return res.status(400).json({ message: "Group name already exists"});

    const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, req.body, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedGroup
        }
    })
}

export const updateGroupImageById = async (req, res) => {
    const group = await Group.findById(req.body.groupId);
    if(!group) return res.status(404).json({ message: "Group doesn't exist"});

    if (req.files[0].filename) {
        const newImage = req.files[0].filename;
        const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, {image: newImage}, { new: true })
        res.status(200).json({
            status: 'success',
            data: { 
                updatedGroup
            }
        })
    }
}

export const deleteGroupById = async (req, res) => {
    const group = await Group.findByIdAndDelete(req.body.groupId);
    if(!group) return res.status(404).json({ message: "Group doesn't exist"});
    res.status(200).json({
        status: 'success',
    });
}

export const addCoOwner = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});
        if(req.body.co_owner_id == group.owner_id) {
            return res.status(404).json({ message: "Failed to invite. User is owner of this group"});
        } 
        const user = await User.findById(req.body.co_owner_id);
        if(!user) return res.status(404).json({ message: "User doesn't exist"});

        // Add userid to the coownerId array of group table
        let i =  group.member_id.indexOf(user._id);
        if (i > -1) { 
            return res.status(404).json({ message: "User is already a member of this group. Please assign him/her to coowner role"});
        }
        i =  group.co_owner_id.indexOf(user._id);
        if (i > -1) { 
            return res.status(404).json({ message: "User is already a coowner of this group."});
        }
        group.co_owner_id.push(user._id);
        const updatedGroup = await Group.findByIdAndUpdate(group._id, {
            co_owner_id: group.co_owner_id
        }, { new: true })

        // Add groupId to the roles.co_owner array of user table
        const roleOfUser = user.roles;
        let index =  roleOfUser.co_owner.indexOf(group._id);
        if (index <= -1) { 
            roleOfUser.co_owner.push(group._id);
        }
        const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })

        res.status(200).json({
            status: 'success',
            updatedGroup
        });
    } catch (error) {
        console.log(error);
    }
}

export const addMemeber = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});
        if(req.body.member_id == group.owner_id) {
            return res.status(404).json({ message: "Failed to invite. User is owner of this group"});
        }
        const user = await User.findById(req.body.member_id);
        if(!user) return res.status(404).json({ message: "User doesn't exist"});

        // Add userid to the memeberId array of group table
        let i =  group.member_id.indexOf(user._id);
        if (i > -1) { 
            return res.status(404).json({ message: "User is already a member of this group."});
        }
        i =  group.co_owner_id.indexOf(user._id);
        if (i > -1) { 
            return res.status(404).json({ message: "User is already a coowner of this group.  Please change him/her to member role"});
        }
        group.member_id.push(user._id);
        const updatedGroup = await Group.findByIdAndUpdate(group._id, {
            member_id: group.member_id
        }, { new: true })

        // Add groupId to the roles.member array of user table
        const roleOfUser = user.roles;
        let index =  roleOfUser.member.indexOf(group._id);
        if (index <= -1) { 
            roleOfUser.member.push(group._id);
        }
        const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })

        res.status(200).json({
            status: 'success',
            updatedGroup
        });
    } catch (error) {
        console.log(error);
    }
}

export const removeCoOwner = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});
        if(req.body.co_owner_id == group.owner_id) {
            return res.status(404).json({ message: "Failed to remove. User is owner of this group"});
        } 
        const user = await User.findById(req.body.co_owner_id);
        if(!user) return res.status(404).json({ message: "User doesn't exist"});

        // Remove userid from the coownerId array of group table
        let i =  group.co_owner_id.indexOf(user._id);
        if (i <= -1) { 
            return res.status(404).json({ message: "user is not a coowner of this group"});
        }
        group.co_owner_id.splice(i, 1);
        const updatedGroup = await Group.findByIdAndUpdate(group._id, {
            co_owner_id: group.co_owner_id
        }, { new: true })

        // Remove groupId from the roles.co_owner array of user table
        const roleOfUser = user.roles;
        let index =  roleOfUser.co_owner.indexOf(group._id);
        if (index > -1) { 
            roleOfUser.co_owner.splice(index, 1);
        }
        const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })

        res.status(200).json({
            status: 'success',
            updatedGroup
        });
    } catch (error) {
        console.log(error);
    }
}

export const removeMemeber = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});
        if(req.body.member_id == group.owner_id) {
            return res.status(404).json({ message: "Failed to remove. User is owner of this group"});
        } 
        const user = await User.findById(req.body.member_id);
        if(!user) return res.status(404).json({ message: "User doesn't exist"});

        // Remove userid from the memberId array of group table
        let i =  group.member_id.indexOf(user._id);
        if (i <= -1) { 
            return res.status(404).json({ message: "user is not a memeber of this group or has another role in group"});
        }
        group.member_id.splice(i, 1);
        const updatedGroup = await Group.findByIdAndUpdate(group._id, {
            member_id: group.member_id
        }, { new: true })

        // Remove groupId from the roles.member array of user table
        const roleOfUser = user.roles;
        let index =  roleOfUser.member.indexOf(group._id);
        if (index > -1) { 
            roleOfUser.member.splice(index, 1);
        }
        const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })

        res.status(200).json({
            status: 'success',
            updatedGroup
        });
    } catch (error) {
        console.log(error);
    }
}

export const toCoOwner = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});
        if(req.body.member_id == group.owner_id) {
            return res.status(404).json({ message: "Failed to change. User is owner of this group"});
        } 
        const user = await User.findById(req.body.member_id);
        if(!user) return res.status(404).json({ message: "User doesn't exist"});

        // Change in group table
        let i =  group.co_owner_id.indexOf(user._id);
        if (i > -1) { 
            return res.status(404).json({ message: "Failed to change. User is already coowner of this group"});
        }
        group.co_owner_id.push(user._id);
        i =  group.member_id.indexOf(user._id);
        if (i > -1) { 
            group.member_id.splice(i, 1);
        }
        const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, {
            member_id: group.member_id,
            co_owner_id: group.co_owner_id
        }, { new: true })

        // change in user table
        const roleOfUser = user.roles;
        let index =  roleOfUser.member.indexOf(group._id);
        if (index > -1) { 
            roleOfUser.member.splice(index, 1);
        }
        index =  roleOfUser.co_owner.indexOf(group._id);
        if (index <= -1) { 
            roleOfUser.co_owner.push(group._id);
        }
        const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })
        
        res.status(200).json({
            status: 'success',
            updatedGroup
        });
    } catch (error) {
        console.log(error);
    }
}

export const toMember = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});
        if(req.body.co_owner_id == group.owner_id) {
            return res.status(404).json({ message: "Failed to change. User is owner of this group"});
        } 
        const user = await User.findById(req.body.co_owner_id);
        if(!user) return res.status(404).json({ message: "User doesn't exist"});

        // change group table
        let i =  group.member_id.indexOf(user._id);
        if (i > -1) { 
            return res.status(404).json({ message: "Failed to change. User is already member of this group"});
        }
        group.member_id.push(user._id);
        i =  group.co_owner_id.indexOf(user._id);
        if (i > -1) { 
            group.co_owner_id.splice(i, 1);
        }
        const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, {
            member_id: group.member_id,
            co_owner_id: group.co_owner_id
        }, { new: true })

        // change table user
        const roleOfUser = user.roles;
        let index =  roleOfUser.co_owner.indexOf(group._id);
        if (index > -1) { 
            roleOfUser.co_owner.splice(index, 1);
        }
        index =  roleOfUser.member.indexOf(group._id);
        if (index <= -1) { 
            roleOfUser.member.push(group._id);
        }
        const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })

        res.status(200).json({
            status: 'success',
            updatedGroup
        });
    } catch (error) {
        console.log(error);
    }
}

export const addMemberViaLink = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});
        if(req.userId == group.owner_id) {
            return res.status(404).json({ message: "Failed to invite. User is owner of this group"});
        }
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({ message: "User doesn't exist"});

        // Add userid to the memeberId array of group table
        let i =  group.member_id.indexOf(user._id);
        if (i > -1) { 
            return res.status(404).json({ message: "User is already a member of this group."});
        }
        i =  group.co_owner_id.indexOf(user._id);
        if (i > -1) { 
            return res.status(404).json({ message: "User is already a coowner of this group.  Please change him/her to member role"});
        }
        group.member_id.push(user._id);
        const updatedGroup = await Group.findByIdAndUpdate(group._id, {
            member_id: group.member_id
        }, { new: true })

        // Add groupId to the roles.member array of user table
        const roleOfUser = user.roles;
        let index =  roleOfUser.member.indexOf(group._id);
        if (index <= -1) { 
            roleOfUser.member.push(group._id);
        }
        const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })

        res.status(200).json({
            ...updatedGroup
        });
    } catch (error) {
        console.log(error);
    }
}

export const sendInviteLink = async (req, res) => {
    try {
        Email.send({
            html: 'Click this link to join group: https://group-master.vercel.app/group/join/' + req.body.groupId,
            receiver: req.body.email,
            subject: 'DLN-Elearning invitation'
        })
        res.status(200).json({ message: 'Send invitation successfully' })
    } catch (error) {
        console.log(error);
    }
}