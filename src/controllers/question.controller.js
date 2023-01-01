import Question from "../models/Question.js";

export const getAllQuestions = async (req, res) => {
    const questions = await Question.find();
    res.status(200).json({
        status: 'success',
        data: { 
            questions
        }
    })
}

export const getQuestions = async (req, res) => {
    const presentationId = req.params.presentationId;
    const limitSize = req.query.limitSize ? parseInt(req.query.limitSize) : 0;
    const index = req.query.index ? parseInt(req.query.index) : 0;

    const questions = await Question.find({presentationId: presentationId}).limit(limitSize).skip(index);;
    res.status(200).json({
        status: 'success',
        data: { 
            questions
        }
    })
}

export const addQuestion = async (req, res) => {
    const {description, createdBy, presentationId} = req.body;
    const newQuestion = new Question({description, createdBy, presentationId});

    const QuestionSaved = await newQuestion.save();
    res.status(200).json({
        status: 'success',
        data: { 
            QuestionSaved
        }
    })
}

export const markAsAnswered = async (req, res) => {
    const question = await Question.findById(req.body.questionId);
    if(!question) return res.status(404).json({ message: "Question doesn't exist"});

    if(question.isAnswered) return res.status(200).json({message: "This Question is already answered"});

    const updatedQuestion = await Question.findByIdAndUpdate(req.body.questionId, {
        isAnswered: true,
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedQuestion
        }
    })
}

export const deleteQuestionById = async (req, res) => {
    const question = await Question.findByIdAndDelete(req.body.questionId);
    if(!question) return res.status(404).json({ message: "Question doesn't exist"});
    res.status(200).json({
        status: 'success',
    });
}
