import Presentation from "../models/Presentation.js";

export const getPresentations = async (req, res) => {
    const presentations = await Presentation.find().populate({ 
        path: 'slides',
        populate: {
            path: 'answeredUser',
            model: 'User'
        } 
    });
    res.status(200).json({
        status: 'success',
        data: { 
            presentations
        }
    })
}

export const getPresentationById = async (req, res) => {
    const presentation = await Presentation.findById(req.params.presentationId).populate({ 
        path: 'slides',
        populate: {
            path: 'answeredUser',
            model: 'User'
        } 
    });
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});

    res.status(200).json({
        status: 'success',
        data: { 
            presentation
        }
    })
}

export const createPresentation = async (req, res) => {
    const alreadyPresentationExist = await Presentation.findOne({ name: req.body.name});
    if(alreadyPresentationExist) return res.status(400).json({ message: "Presentation already exists"});

    // Create new presentation with a default slide and set the default to be the current presented slide
    const newPresentation = new Presentation({name: req.body.name, createdBy: req.userId});
    newPresentation.slides.push({
        "question": "Sample Question",
        "answers": [
            {
                "answer": "Sample Answer",
                "count": 0
            }
        ]
    },);
    newPresentation.currentSlide = newPresentation.slides[0];
    const presentationSaved = await newPresentation.save();
    res.status(200).json({
        status: 'success',
        data: { 
            presentationSaved
        }
    })
}

export const updatePresentationNameById = async (req, res) => {
    const {presentationId, newName} = req.body;

    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});

    const alreadyPresentationExist = await Presentation.findOne({ name: newName});
    if(alreadyPresentationExist) return res.status(400).json({ message: "This name already exists"});
    
    const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
        name: newName
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}

export const deletePresentationById = async (req, res) => {
    const presentation = await Presentation.findByIdAndDelete(req.body.presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});
    res.status(200).json({
        status: 'success',
    });
}

export const toPrivate = async (req, res) => {
    const presentation = await Presentation.findByIdAndDelete(req.body.presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});
    if(presentation.isPrivate) return res.status(200).json({message: "This presentation is already private"});

    const updatedPresentation = await Presentation.findByIdAndUpdate(req.body.presentationId, {
        isPrivate: true,
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}

export const toPublic = async (req, res) => {
    const presentation = await Presentation.findByIdAndDelete(req.body.presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});
    if(!presentation.isPrivate) return res.status(200).json({message: "This presentation is already public"});

    const updatedPresentation = await Presentation.findByIdAndUpdate(req.body.presentationId, {
        isPrivate: false,
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}

export const changeAllSlides = async (req, res) => {
    const { slides, presentationId } = req.body; 
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(400).json({ message: "Presentation does not exist"});
    
    // Handle if the current presented slide is deleted
    let foundSlide = presentation.slides.filter(slide => slide._id.equals(presentation.currentSlide._id));
    if(!foundSlide[0]) {
        presentation.currentSlide = slides[0];
        presentation.slides = slides;
    } else {
        presentation.currentSlide = foundSlide[0];
        presentation.slides = slides;
    }

    const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
        slides: presentation.slides,
        currentSlide: presentation.currentSlide
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}

export const changeCurrentSlide = async (req, res) => {
    const { currSlideId, presentationId } = req.body; 
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(400).json({ message: "Presentation does not exist"});
  
    let foundSlide = presentation.slides.filter(slide => slide._id.equals(currSlideId));
    if(!foundSlide[0]) return res.status(400).json({ message: "The slide ID does not exist"});
    
    const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
        currentSlide: foundSlide[0]
    }, { new: true }).populate({ 
        path: 'slides',
        populate: {
            path: 'answeredUser',
            model: 'User'
        } 
    });
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}

export const deleteAllSlides = async (req, res) => {
    const {presentationId } = req.body; 
    console.log(presentationId);
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(400).json({ message: "Presentation does not exist"});
    
    const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
        slides: null
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}

export const answerSlideQuestion = async (req, res) => {
    const { presentationId, answerId } = req.body; 
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(400).json({ message: "Presentation does not exist"});
    
    if(req.userId) {
        let answeredUser = presentation.currentSlide.answeredUser.filter(userId => userId.equals(req.userId));
        if(answerId[0]) return res.status(400).json({ message: "You have answered this question"});
    }

    let foundAns = presentation.currentSlide.answers.filter(ans => ans._id.equals(answerId));
    if(!foundAns[0]) return res.status(400).json({ message: "The answer ID does not exist in the current presentation"});
    
    // add user id to the answered User if user logined
    if(req.userId) {
        presentation.currentSlide.answeredUser.push(req.userId);
    }
    // Increase count in the currentSlide property and in the Presentation.slides[index]
    presentation.currentSlide.answers.map(ans =>{ 
        if (ans._id.equals(answerId)) {
            ans.count += 1;
        }
    });
    presentation.slides.map(slide => {
        if (slide._id.equals(presentation.currentSlide._id)) {
            slide.answers = presentation.currentSlide.answers;
            slide.answeredUser= presentation.currentSlide.answeredUser;
        }
    })

    const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
        slides: presentation.slides,
        currentSlide: presentation.currentSlide
    }, { new: true }).populate({ 
        path: 'slides',
        populate: {
            path: 'answeredUser',
            model: 'User'
        } 
    });
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}