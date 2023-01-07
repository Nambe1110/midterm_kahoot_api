import {Schema, model} from 'mongoose';

const answerSchema = new Schema({
    answer: { type: String, trim: true, default:""},
    count: { type: Number, default: 0},
    answersList: [{
        userId: {type: Schema.Types.ObjectId, ref:'User'},
        name: {type: String, trim: true},
        answeredAt: {type: Date, default: new Date()}
    }]
}); 

const slideSchema = new Schema({
    question: { type: String, trim: true, default:"", maxlength: 1000},
    answers: [answerSchema],
    correctAnswer: { type: String, trim: true, default:""},
    answeredUser: [{type: Schema.Types.ObjectId, ref:'User', default:[]}],
    chartType: { type: String, trim: true, default:"bar"},
    subheading: { type: String, trim: true, default:""},
    paragraph: { type: String, trim: true, default:""},
    slideType: { type: String, trim: true, default:"multi"}
}); 

const presentationSchema = new Schema({
    name: { type: String, required: true, unique:true, trim: true},
    currentSlide: slideSchema,
    slides: [slideSchema],
    isPrivate: { type:Boolean, required: true, default: false},
    isPresenting: { type:Boolean, required: true, default: false},
    collaborators: [{type: Schema.Types.ObjectId, ref:'User', default:[]}],
    createdBy: {type: Schema.Types.ObjectId, ref:'User'},
    groupId: {type: Schema.Types.ObjectId, ref:'Group', default:null}
},{
    timestamps: true,
    versionKey: false,
    strictPopulate: true
});

export default model("Presentation", presentationSchema);