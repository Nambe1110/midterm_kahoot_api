import Group from "../models/Group.js";


export const createGroup = async (req, res) => {
    /* console.log(req.body); */
    const {name,imgURL,owner_id,co_owner_id, member_id} = req.body;
    const newGroup = new Group({name, imgURL, owner_id, co_owner_id, member_id});
    const groupSaved = await newGroup.save();
    res.status(200).json({
        status: 'success',
        data: { 
            groupSaved
        }
    })
}

export const getAllGroups = async (req, res) => {
    const allGroups = await Group.findAll();
    res.status(200).json({
        status: 'success',
        data: { 
            allGroups
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
    const Group = await Group.findById(req.params.GroupId);
    res.status(200).json({
        status: 'success',
        data: { 
            Group
        }
    })
}

export const getGroupByName = async (req, res) => {
    const Group = await Group.findOne( {name: req.params.GroupName});
    res.status(200).json({
        status: 'success',
        data: { 
            Group
        }
    })
}

export const updateGroupById = async (req, res) => {
    const updatedGroup = await Group.findByIdAndUpdate(req.params.GroupId, req.body, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedGroup
        }
    })
}

export const deleteGroupById = async (req, res) => {
    const { GroupId } = req.params;
    await Group.findByIdAndDelete(GroupId);
    res.status(204).json({
        status: 'success',
    });
}