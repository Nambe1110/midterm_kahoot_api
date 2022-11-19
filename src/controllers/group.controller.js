import Group from "../models/Group.js";
import { ObjectId } from "mongoose";

export const createGroup = async (req, res) => {
    const {name, owner_id, co_owner_id, member_id} = req.body;
    const image = req.files[0].filename;
    const newGroup = new Group({name, image, owner_id, co_owner_id, member_id});

    const alredyGroupExist = await User.findOne({ name: newGroup.name});
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
    const Group = await Group.findOne({_id: req.params.groupId });
    console.log(req.params.groupId);
    res.status(200).json({
        status: 'success',
        data: { 
            Group
        }
    })
}

export const getGroupByName = async (req, res) => {
    const Group = await Group.findOne( {name: req.params.groupName});
    res.status(200).json({
        status: 'success',
        data: { 
            Group
        }
    })
}

export const updateGroupNameById = async (req, res) => {
    const {name} = req.body;

    const alredyGroupExist = await User.findOne({ name: name});
    if(alredyGroupExist) return res.status(400).json({ message: "Group name already exists"});

    const updatedGroup = await Group.findByIdAndUpdate(req.body.groupId, req.body, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedGroup
        }
    })
}

export const deleteGroupById = async (req, res) => {
    const group = await Group.findByIdAndDelete(req.body.groupId);
    res.status(204).json({
        status: 'success',
        data: {
            group
        }
    });
}