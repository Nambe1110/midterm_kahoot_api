import Chat from "../models/Chat.js";
import Presentation from "../models/Presentation.js";

export const getAllChats = async (req, res) => {
    const chats = await Chat.find().sort({createdAt:-1});
    res.status(200).json({
        status: 'success',
        data: { 
            chats
        }
    })
}

export const getChats = async (req, res) => {
    const presentationId = req.params.presentationId;
    const limitSize = req.query.limitSize ? parseInt(req.query.limitSize) : 0;
    const index = req.query.index ? parseInt(req.query.index) : 0;

    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation does not exist"});

    const chats = await Chat.find({presentationId: presentationId}).limit(limitSize).skip(index).sort({createdAt:-1});
    res.status(200).json({
        status: 'success',
        data: { 
            chats
        }
    })
}

export const addChat = async (req, res) => {
    const {message, createdUserName, presentationId} = req.body;
    const newChat = new Chat({message, createdUserName, presentationId});

    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation does not exist"});

    const ChatSaved = await newChat.save();
    res.status(200).json({
        status: 'success',
        data: { 
            ChatSaved
        }
    })
}

export const deleteChatById = async (req, res) => {
    const chat = await Chat.findByIdAndDelete(req.body.chatId);
    if(!chat) return res.status(404).json({ message: "Chat doesn't exist"});
    res.status(200).json({
        status: 'success',
    });
}
