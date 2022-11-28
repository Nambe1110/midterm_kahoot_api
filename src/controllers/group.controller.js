import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
    const {name, co_owner_id, member_id} = req.body;
    const owner_id = req.userId;
    const newGroup = new Group({name, owner_id, co_owner_id, member_id});
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
