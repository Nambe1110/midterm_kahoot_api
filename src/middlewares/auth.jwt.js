import config from '../config.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Role from '../models/Role.js';
import Group from '../models/Group.js';

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

