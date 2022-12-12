import config from '../config.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Role from '../models/Role.js';
import Group from '../models/Group.js';
import Presentation from "../models/Presentation.js";

export const verifyToken = async (req, res, next) => { 
    try {
        const token = req.headers["x-access-token"];
        if (!token)  return res.status(403).json({ message: "No token provided" });

        const decoded = jwt.verify(token, config.SECRET);
        req.userId = decoded.id;
        

        const user = await User.findById(req.userId, { password: 0 });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        next();

    }catch(error){  
        return res.status(401).json({message: 'unauthorized'})    
    }
}

export const verifyIfHaveToken = async (req, res, next) => { 
    try {
        if(req.headers["x-access-token"]) {
            const token = req.headers["x-access-token"];
            const decoded = jwt.verify(token, config.SECRET);
            req.userId = decoded.id;
        }
        
        next();

    }catch(error){  
        return res.status(401).json({message: 'unauthorized'})    
    }
}

export const isAdmin = async (req, res, next)=> {
    const user = await User.findById(req.userId);
    console.log(req.userId); 
    const systemRole = await Role.findOne({_id: {$in: user.systemRole}});
    if (systemRole.name === "admin"){
        next();
        return;
    }
    return res.status(403).json({message: "requested admin role"})
}

export const isOwnerOfGroup = async (req, res, next)=> {
    const user = await User.findById(req.userId);
    const roleOfUser = user.roles;
    console.log(user);
    let index =  roleOfUser.owner.indexOf(req.body.groupId);
    if (index > -1){
        next();
        return;
    }
    return res.status(403).json({message: "requested owner role of this group"})
}

export const isCoOwnerOfGroup= async (req, res, next)=> {
    const user = await User.findById(req.userId);
    const roleOfUser = user.roles;

    let index =  roleOfUser.co_owner.indexOf(req.body.groupId);
    if (index > -1){
        next();
        return;
    }
    return res.status(403).json({message: "requested co-owner role of this group"})
}

export const isOwnerOrCoOwner= async (req, res, next)=> {
    const user = await User.findById(req.userId);
    const roleOfUser = user.roles;

    let index1 =  roleOfUser.owner.indexOf(req.body.groupId);
    let index2 =  roleOfUser.co_owner.indexOf(req.body.groupId);
    if (index1 > -1 || index2 > -1){
        next();
        return;
    }
    return res.status(403).json({message: "requested owner or co-owner role of this group"})
}

export const isMemberOfGroup= async (req, res, next)=> {
    const user = await User.findById(req.userId);
    const roleOfUser = user.roles;

    let index =  roleOfUser.member.indexOf(req.body.groupId);
    if (index > -1){
        next();
        return;
    }
    return res.status(403).json({message: "requested memeber role of this group"})
}

export const isOwnerOfPresentation = async (req, res, next)=> {
    const presentation = await Presentation.findById(req.body.presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});

    console.log(presentation.createdBy)
    console.log(req.userId)
    if (presentation.createdBy == req.userId){
        next();
        return;
    }
    return res.status(403).json({message: "requested owner of this presentation"})
}
