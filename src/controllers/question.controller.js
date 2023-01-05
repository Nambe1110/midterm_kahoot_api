import Question from "../models/Question.js";
import User from "../models/User.js";

export const getAllQuestions = async (req, res) => {
    const questions = await Question.find().sort({voteCount:-1});
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

    const questions = await Question.find({presentationId: presentationId}).limit(limitSize).skip(index).sort({voteCount:-1});
    res.status(200).json({
        status: 'success',
        data: { 
            questions
        }
    })
}

export const addQuestion = async (req, res) => {
    const {description, createdUserName, presentationId} = req.body;
    const newQuestion = new Question({description, createdUserName, presentationId});

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

export const vote = async (req, res) => {
    const {questionId, userId} = req.body // if anonymous vote, userId: null

    const question = await Question.findById(questionId);
    if(!question) return res.status(404).json({ message: "Question doesn't exist"});

    // If user is authenticated
    if (userId) {
        const user = await User.findById(userId);
        if (!user) return res.status(400).send("Invalid user");
        if (question.votedUsers.includes(userId)) return res.status(400).json({message: "This user has already voted for this question"});
        
        question.votedUsers.push(userId);
    }

    //Anonymous user: do nothing

    question.voteCount++;
    
    const updatedQuestion = await Question.findByIdAndUpdate(questionId, {
        voteCount: question.voteCount,
        votedUsers: question.votedUsers
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
