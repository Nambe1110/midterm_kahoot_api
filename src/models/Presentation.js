import {Schema, model} from 'mongoose';

const slideSchema = new Schema({
    question: { type: String, trim: true, default:"", maxlength: 1000},
    answers: [{
        answer: { type: String, trim: true, default:""},
        count: { type: Number, default: 0}
    }],
    correctAnswer: { type: String, trim: true, default:""},
    answeredUser: [{type: Schema.Types.ObjectId, ref:'User', default:[]}]
}); 

const presentationSchema = new Schema({
    name: { type: String, required: true, unique:true, trim: true},
    currentSlide: slideSchema,
    slides: [slideSchema],
    isPrivate: { type:Boolean, required: true, default: false},
    createdBy: {type: Schema.Types.ObjectId, ref:'User'}
},{
    timestamps: true,
    versionKey: false,
    strictPopulate: true
});

export default model("Presentation", presentationSchema);