import { Schema, model } from "mongoose";

const chatSchema = new Schema(
    {
        message: {type: String, required: true},
        createdBy: {type: String, required: true, trim: true},
        presentationId: {type: Schema.Types.ObjectId, required :true, ref: 'Presentation'}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Chat', chatSchema);