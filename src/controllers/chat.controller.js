import Chat from "../models/Chat.js";

export const getAllChats = async (req, res) => {
    const chats = await Chat.find();
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

    const chats = await Chat.find({presentationId: presentationId}).limit(limitSize).skip(index);;
    res.status(200).json({
        status: 'success',
        data: { 
            chats
        }
    })
}

export const addChat = async (req, res) => {
    const {message, createdBy, presentationId} = req.body;
    const newChat = new Chat({message, createdBy, presentationId});

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
