import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
    {
        content: {type:String, required:true},
        isRead: { type:Boolean, required: true, default: false},
        userId: {type:Schema.Types.ObjectId, required:true, ref:'User'}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Notification', notificationSchema);