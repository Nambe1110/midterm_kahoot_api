import {Schema, model} from 'mongoose';

const presentationSchema = new Schema({
    name: { type: String, required: true, unique:true, trim: true},
    current: { type: Schema.Types.ObjectId, default: null},
    slides: [{
        slideId: { type: Schema.Types.ObjectId, auto: true, required: true},
        question: { type: String, trim: true, maxlength: 1000},
        answers: [{
            answer: { type: String, trim: true},
            count: { type: Number, default: 0}
        }],
        correctAnswer: { type: String, trim: true}
    }],
    isPrivate: { type:Boolean, required: true, default: false}
},{
    timestamps: true,
    versionKey: false
});

export default model("Presentation", presentationSchema);