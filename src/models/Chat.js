import { Schema, model } from "mongoose";

const chatSchema = new Schema(
    {
        message: {type:String, required:true},
        createdBy: {type: String, trim: true},
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Chat', chatSchema);