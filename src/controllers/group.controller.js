import Group from "../models/Group.js";

export const createGroup = async (req, res) => {

    const newGroup = new Group();
    newGroup.name = req.body.name;
    newGroup.owner_id = req.userId;
    newGroup.co_owner_id = req.body.owner_id;
    newGroup.member_id = req.body.member_id;
    if (req.files[0].filename) {
        newGroup.image = req.files[0].filename;
    }

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

export const getGroupByName = async (req, res) => {
    const group = await Group.findOne( {name: req.params.groupName});
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