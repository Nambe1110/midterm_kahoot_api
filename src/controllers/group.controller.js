import Group from "../models/Group.js";
import User from "../models/User.js";

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

export const addCoOwners = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});

        const co_owner_idList = group.co_owner_id.concat(req.body.co_owner_id);
        const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, {co_owner_id: co_owner_idList}, { new: true })

        co_owner_idList.map(async (co_owner_id) => {
            const user = await User.findById(co_owner_id);
            const roleOfUser = user.roles;
            roleOfUser.co_owner.push(group._id);
            const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })
        })
        res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        console.log(error);
    }
}

export const addMemebers = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});

        const member_idList = group.member_id.concat(req.body.member_id);
        const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, {member_id: member_idList}, { new: true })

        member_idList.map(async (member_id) => {
            const user = await User.findById(member_id);
            const roleOfUser = user.roles;
            roleOfUser.member.push(group._id);
            const updatedUser = await User.findByIdAndUpdate(user._id, {roles: roleOfUser}, { new: true })
        })
        res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        console.log(error);
    }
}

export const removeCoOwners = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});

        const toDeleteSet = new Set(req.body.co_owner_id);
        const co_owner_idList = group.co_owner_id.filter((co_owner_id) => {
            // return those elements not in the toDeleteSet
            return !toDeleteSet.has(co_owner_id);
          });
        const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, {co_owner_id: co_owner_idList}, { new: true })

        co_owner_idList.map(async (co_owner_id) => {
            const user = await User.findById(co_owner_id);
            const roleOfUser = user.roles;
            const index =  roleOfUser.co_owner.indexOf(group._id);
            if (index > -1) { 
                roleOfUser.co_owner.splice(index, 1);
            }
            const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })
        })
        res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        console.log(error);
    }
}

export const removeMemebers = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});

        const toDeleteSet = new Set(req.body.member_id);
        const member_idList = group.member_id.filter((member_id) => {
            // return those elements not in the toDeleteSet
            return !toDeleteSet.has(member_id);
          });
        const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, {member_id: member_idList}, { new: true })

        member_idList.map(async (member_id) => {
            const user = await User.findById(member_id);
            const roleOfUser = user.roles;
            const index =  roleOfUser.member.indexOf(group._id);
            if (index > -1) { 
                roleOfUser.member.splice(index, 1);
            }
            const updatedUser = await User.findByIdAndUpdate(user._id ,{roles: roleOfUser}, { new: true })
        })
        res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        console.log(error);
    }
}

export const toCoOwner = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});
        const user = await User.findById(req.body.member_id);
        if(!user) return res.status(404).json({ message: "User doesn't exist"});

        let i =  group.member_id.indexOf(user._id);
        if (i > -1) { 
            group.member_id.splice(i, 1);
        }
        i =  group.co_owner_id.indexOf(user._id);
        if (i <= -1) { 
            group.co_owner_id.push(user._id);
        }
        const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, {
            member_id: group.member_id,
            co_owner_id: group.co_owner_id
        }, { new: true })

        
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
        });
    } catch (error) {
        console.log(error);
    }
}

export const toMember = async (req, res) => {
    try {
        const group = await Group.findById(req.body.groupId);
        if(!group) return res.status(404).json({ message: "Group doesn't exist"});
        const user = await User.findById(req.body.co_owner_id);
        if(!user) return res.status(404).json({ message: "User doesn't exist"});

        let i =  group.co_owner_id.indexOf(user._id);
        if (i > -1) { 
            group.co_owner_id.splice(i, 1);
        }
        i =  group.member_id.indexOf(user._id);
        if (i <= -1) { 
            group.member_id.push(user._id);
        }
        const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, {
            member_id: group.member_id,
            co_owner_id: group.co_owner_id
        }, { new: true })

        
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
        });
    } catch (error) {
        console.log(error);
    }
}

export const joinByGroupId = async (req, res) => {
    const group = await Group.findById(req.params.groupId);
    if(!group) return res.status(404).json({ message: "Group doesn't exist"});
    if (group.member_id.includes(req.userId) || group.co_owner_id.includes(req.userId) || group.owner_id === req.userId) {
        return res.status(401).json({ message: "User already existed in group"});
    }
    group.member_id.push(req.userId);
    const updatedGroup = await group.save();
    return res.status(200).json(updatedGroup)
}
