import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import Role from '../models/Role.js';

export const signUp = async (req, res) => {
    const { email, password, firstname, lastname, yearOfBirth, gender, address } = req.body;
    
    const newUser = new User({
        email,
        password: await User.encryptPassword(password),
        firstname,
        lastname,
        yearOfBirth,
        gender,
        address
    })

    const alredyUserExist = await User.findOne({ email: newUser.email});

    if(alredyUserExist) return res.status(400).json({ message: "user already exists"});

    const role = await Role.findOne({name: 'user'})
    newUser.roles = [role._id];
    console.log(newUser.roles);
    
    const savedUser = await newUser.save();
    console.log(savedUser);

    const token = jwt.sign({id: savedUser._id}, config.SECRET, {
        expiresIn: 86400
    })
    
    res.status(200).json({
        status: 'success',
        data: { 
            accessToken:token
        }
    })
}
export const signIn = async (req, res) => {
    
    const userFound = await User.findOne({email: req.body.email}).populate("roles");
    if(!userFound) return res.status(404).json({message: "user not found"})

    const matchPassword = await User.comparePassword(req.body.password, userFound.password);

    if(!matchPassword) return res.status(401).json({ token: null, message: "Invalid password"});

    const token = jwt.sign({id: userFound._id}, config.SECRET, { expiresIn: 86400 });
    console.log(userFound);
    
    res.status(200).json({
        status: 'success',
        data: { 
            id:userFound._id,
            email:userFound.email,
            password:userFound.password,
            accessToken:token
        }
    })
};


