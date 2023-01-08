import User from '../models/User.js';
import Token from '../models/Token.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config.js';
import Role from '../models/Role.js';
import { Email } from '../modules/Email.js';
import { getDecodedOAuthJwtGoogle } from '../utils/OAuth.js';

export const signUp = async (req, res) => {
    const { email, password, firstname, lastname, yearOfBirth, gender, address } = req.body;
    
    const newUser = new User({
        email,
        password: await User.encryptPassword(password),
        firstname,
        lastname,
        yearOfBirth,
        address
    })

    const alredyUserExist = await User.findOne({ email: newUser.email});

    if(alredyUserExist) return res.status(403).json({ message: "user already exists"});

    const systemRole = await Role.findOne({name: 'user'})
    newUser.systemRole = systemRole._id;
    
    const savedUser = await newUser.save();
    console.log(savedUser);

    const jwtToken = jwt.sign({id: savedUser._id}, config.SECRET, {
        expiresIn: 86400
    });

    let activateToken = await new Token({
        userId: savedUser._id,
        token: crypto.randomBytes(32).toString("hex"),
    }).save();
  
    const message = ` Hi ${savedUser.firstname}, <br>
                    <br>Thank you for registering Dln Learning Application. Your account is ready. <br>
                    Please follow this link to activate your Dln Elearning account: <a href="${process.env.HOST_URL}/api/user/verify/${savedUser._id}/${activateToken.token}">Verify account link </a>  <br>
                    <br>If you don't sign up for a Dln Learning account, please disregard this email. <br>
                    Sorry for your time. <br>
                    <br>Best regards, <br>
                    Dln Learning Application Team <br>
    `;

    await Email.send({
        html: message,
        receiver: savedUser.email,
        subject: 'Dln Elearning Application - Activate account',
    })

    res.status(200).json({
        status: 'success',
        message: 'An Email sent to your registered email account to activate your account. Please follow the provided link to activate your account'
    })
}
export const signIn = async (req, res) => {
    
    const userFound = await User.findOne({email: req.body.email}).populate("systemRole");
    if(!userFound) return res.status(404).json({message: "user not found"})

    const matchPassword = await User.comparePassword(req.body.password, userFound.password);

    if(!matchPassword) return res.status(401).json({ token: null, message: "Invalid password"});

    const token = jwt.sign({id: userFound._id}, config.SECRET, { 
            // expiresIn: 86400 
        }
    );
    console.log(userFound);
    
    if (!userFound.isActivated) return res.status(401).json({message: "user is not activated"})
    
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

export const googleSignIn = async (req, res) => {
    const { credential } = req.body;
    try {
        const realUserData = await getDecodedOAuthJwtGoogle(credential) // credentials === JWT token
        console.log(realUserData);
        const newUser = new User({
            email: realUserData.payload.email,
            firstname: realUserData.payload.given_name,
            lastname: realUserData.payload.family_name,
            avatar: realUserData.payload.picture,
            yearOfBirth: null,
            address: null,
            isActivated: true, 
            password: await User.encryptPassword("default"),
        })
        let savedUser;

        const userFound = await User.findOne({email: realUserData.payload.email}).populate("systemRole");
        if(!userFound) {
            const systemRole = await Role.findOne({name: 'user'})
            newUser.systemRole = systemRole._id;

            savedUser = await newUser.save();
            console.log(savedUser);
        } else {
            savedUser = userFound;
        }

        const token = jwt.sign({id: savedUser._id}, config.SECRET, { 
                // expiresIn: 86400 
            }
        );

        if (!savedUser.isActivated) {
            await User.findByIdAndUpdate(savedUser._id, {isActivated: true}, { new: true } );
        }
        
        res.status(200).json({
            status: 'success',
            data: { 
                id: savedUser._id,
                email: savedUser.email,
                password: savedUser.password,
                accessToken:token
            }
        })
    } catch (e) {
        console.log(e);
    }
};

export const requestResetPassword = async (req, res) => {
    
    const userFound = await User.findOne({email: req.body.email}).populate("systemRole");
    if(!userFound) return res.status(404).json({message: "user not found"})
    if (!userFound.isActivated) return res.status(401).json({message: "user is not activated"})
    
    let resetPassword = await new Token({
        userId: userFound._id,
        token: crypto.randomBytes(32).toString("hex"),
        tokenType: "resetPassword"
    }).save();
  
    const message = `Hi ${userFound.firstname}, <br>
                    Please follow this link to continue the process of reseting your account password: <a href="${process.env.FE_HOST_URL}/account/resetpassword/${resetPassword.userId}/${resetPassword.token}">Reset password link </a>  <br>
                    <br>If you don't request to reset the password, please disregard this email. <br>
                    Sorry for your time. <br>
                    <br>Best regards, <br>
                    Dln Learning Application Team <br>
    `;

    await Email.send({
        html: message,
        receiver: userFound.email,
        subject: 'Dln Elearning Application - Reset account password',
    })

    res.status(200).json({
        status: 'success',
        message: 'An Email sent to your registered email account. Please follow the provided link to continue the process of reseting your account password.'
    })
};

