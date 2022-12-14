import { Schema, model } from "mongoose";

const questionSchema = new Schema(
    {
        description: {type: String, required: true, unique: true},
        createdUserName: {type: String, required: true, trim: true},
        isAnswered: { type: Boolean, required: true, default: false},
        voteCount: {type: Number , required: true, default: 0},
        presentationId: {type: Schema.Types.ObjectId, required :true, ref: 'Presentation'},
        votedUsers: [{type:Schema.Types.ObjectId, required:true, ref:'User', default:[]}]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Question', questionSchema);