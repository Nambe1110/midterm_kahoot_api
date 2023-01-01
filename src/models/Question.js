import { Schema, model } from "mongoose";

const questionSchema = new Schema(
    {
        description: {type:String, required:true, unique:true},
        createdBy: {type: String, required:true, trim: true},
        isAnswered: { type:Boolean, required: true, default: false},
        voteCount: {type:Integer, required: true, default:0}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Question', questionSchema);