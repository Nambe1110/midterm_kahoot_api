import Presentation from "../models/Presentation.js";
import User from '../models/User.js';
import Group from "../models/Group.js";

export const getTotalPresentations = async (req, res) => {
    const presentations = await Presentation.find().populate([
        { 
            path: 'slides',
            populate: {
                path: 'answeredUser',
                model: 'User'
            } 
        },
        {
            path: "collaborators",
            model: 'User'
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: { 
            presentations
        }
    })
}

export const getAllPresentations = async (req, res) => {
    const user = await User.findById(req.userId) ;

    const allPublicPresentations = await Presentation.find({
            isPrivate: false
        }).populate([
        { 
            path: 'slides',
            populate: {
                path: 'answeredUser',
                model: 'User'
            } 
        }
    ]);
    
    const publicPresentations = allPublicPresentations.filter(presentation => {
        return presentation.createdBy.equals(user._id) || presentation.collaborators.includes(user._id);
    })


    const allPrivatePresentations = await Presentation.find({
            isPrivate: true
        }).populate([
        { 
            path: 'slides',
            populate: {
                path: 'answeredUser',
                model: 'User'
            } 
        },
        {
            path: "collaborators",
            model: 'User'
        }
    ]);

    const privatePresentations = allPrivatePresentations.filter(presentation => {
        return user.roles.owner.includes(presentation.groupId) || user.roles.co_owner.includes(presentation.groupId);
    })


    if(!publicPresentations[0] && !privatePresentations[0]) return res.status(200).json({message: "There is no presentation created or collaborated by this user"})
    
    res.status(200).json({
        status: 'success',
        data: { 
            publicPresentations: publicPresentations,
            privatePresentations: privatePresentations
        }
    })
}

export const getPresentationsOfGroup = async (req, res) => {
    const presentations = await Presentation.find({
        groupId: req.params.groupId,
        isPrivate: true
    }).populate([
        { 
            path: 'slides',
            populate: {
                path: 'answeredUser',
                model: 'User'
            } 
        },
        {
            path: "collaborators",
            model: 'User'
        },
        {
            path: "createdBy",
            model: 'User'
        },
        { 
            path: 'currentSlide',
            populate: {
                path: 'answeredUser',
                model: 'User'
            } 
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: { 
            presentations
        }
    })
}

export const getPresentationById = async (req, res) => {
    const presentation = await Presentation.findById(req.params.presentationId).populate([
        { 
            path: 'slides',
            populate: {
                path: 'answeredUser',
                model: 'User'
            } 
        },
        {
            path: "collaborators",
            model: 'User'
        }
    ]);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});

    res.status(200).json({
        status: 'success',
        data: { 
            presentation
        }
    })
}

export const getCollaboratorsOfPresentation = async (req, res) => {
    const presentation = await Presentation.findById(req.params.presentationId).populate([
        {
            path: "collaborators",
            model: 'User'
        }
    ]);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});
    if(presentation.isPrivate) return res.status(403).json({ message: "Presentation is not public presentation"});

    res.status(200).json({
        status: 'success',
        data: { 
            collaborators: presentation.collaborators
        }
    })
}

export const createPublicPresentation = async (req, res) => {
    const alreadyPresentationExist = await Presentation.findOne({ name: req.body.name});
    if(alreadyPresentationExist) return res.status(3).json({ message: "Presentation already exists"});

    // Create new presentation with a default slide and set the default to be the current presented slide
    const newPresentation = new Presentation({name: req.body.name, createdBy: req.userId});
    newPresentation.slides.push({
        "question": "Sample Question",
        "answers": [
            {
                "answer": "Sample Answer",
                "count": 0
            }
        ],
        "chartType": "bar",
        "slideType": "multi"
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

    // The check whether the presentation exist or not is done in the Middle ware function

    const alreadyPresentationExist = await Presentation.findOne({ name: newName});
    if(alreadyPresentationExist) return res.status(403).json({ message: "This name already exists"});
    
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
    const presentation = await Presentation.findById(req.body.presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});
    if(presentation.isPresenting) return res.status(403).json({ message: "Can not delete presentation when it is presenting now"});

    if(presentation.isPrivate) {
        const group = await Group.findById(presentation.groupId);
        if (group.owner_id != req.userId && !group.co_owner_id.includes(req.userId)) {
            return res.status(401).json({ message: "Requested owner or coowner role of group to delete this group presentation"});
        }
    }
    else {
        if (!presentation.createdBy.equals(req.userId)) {
            return res.status(401).json({ message: "Requested owner role of this public presentation"});
        }
    }

    const deletedPresentation = await Presentation.findByIdAndDelete(req.body.presentationId);
    res.status(200).json({
        status: 'success',
    });
}

export const addCollaborators = async (req, res) => {
    try {
        const { presentationId, email} = req.body;
        const presentation = await Presentation.findById(presentationId);
        if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});
        if(presentation.isPrivate) return res.status(404).json({ message: "Can not add collaborator to private presentation"});
        
        if (!presentation.createdBy.equals(req.userId)) {
            return res.status(401).json({ message: "Requested owner role of this public presentation"});
        }

        const user = await User.findOne({email: email});
        if(!user) return res.status(404).json({ message: "User not found"});
        if (presentation.createdBy == user._id) return res.status(404).json({ message: "Can not add the user who created the presentaion to be a collaborator"});
        if (presentation.collaborators.includes(user._id)) return res.status(403).json({ message: "This user is already a collaborator"});
        
        presentation.collaborators.push(user._id);

        const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
            collaborators:  presentation.collaborators
        }, { new: true }).populate([
            { 
                path: 'slides',
                populate: {
                    path: 'answeredUser',
                    model: 'User'
                } 
            },
            {
                path: "collaborators",
                model: 'User'
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: { 
                updatedPresentation
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export const removeCollaborators = async (req, res) => {
    const { presentationId, email} = req.body;

    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});
    if(presentation.isPrivate) return res.status(403).json({ message: "Can not remove collaborator of private presentation"});
    
    if (!presentation.createdBy.equals(req.userId)) {
        return res.status(401).json({ message: "Requested owner role of this public presentation"});
    }
    
    const user = await User.findOne({email: email});
    if(!user) return res.status(404).json({ message: "User not found"})
    if (!presentation.collaborators.includes(user._id)) return res.status(403).json({ message: "This user is not a collaborator of this presentation"});

    const index = presentation.collaborators.indexOf(user._id);
    presentation.collaborators.splice(index, 1);

    const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
        collaborators:  presentation.collaborators
    }, { new: true }).populate([
        { 
            path: 'slides',
            populate: {
                path: 'answeredUser',
                model: 'User'
            } 
        },
        {
            path: "collaborators",
            model: 'User'
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    });
}

export const toPrivate = async (req, res) => {
    const presentation = await Presentation.findById(req.body.presentationId);
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
    const presentation = await Presentation.findById(req.body.presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});
    if(!presentation.isPrivate) return res.status(403).json({message: "This presentation is already public"});

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
    if(!presentation) return res.status(404).json({ message: "Presentation does not exist"});
    if(presentation.isPresenting) return res.status(403).json({ message: "Can not edit presentation when it is presenting"});

    if(presentation.isPrivate) {
        const group = await Group.findById(presentation.groupId);
        if (group.owner_id != req.userId && !group.co_owner_id.includes(req.userId)) {
            return res.status(401).json({ message: "Requested owner or coowner role of group to edit this group presentation"});
        }
    }
    else {
        if (!presentation.createdBy.equals(req.userId) && !presentation.collaborators.includes(req.userId)) {
            return res.status(401).json({ message: "Requested owner/collaborator role of this public presentation"});
        }
    }

    let updatedPresentation;

    // Handle if the current presented slide is deleted new slides array
    // First, update the slides array to db to make sure that all the slides have the _id
    // -> The, Point the first slide of the new slides array(already has _id) to be current presented
    let foundSlide = slides.filter(slide => slide._id && slide._id == presentation.currentSlide._id);
    if(!foundSlide[0]) {
        const updated = await Presentation.findByIdAndUpdate(presentationId, {
            slides: slides
        }, { new: true })
        updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
            currentSlide: updated.slides[0]
        }, { new: true })
    } 
    // The current presented slide is still exist (may be modified or still the same as in the database)
    // -> Update the currentSlide together the slides array
    else {
        updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
            slides: slides,
            currentSlide: foundSlide[0]
        }, { new: true })
    }

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
    if(!presentation) return res.status(404).json({ message: "Presentation does not exist"});
  
    let foundSlide = presentation.slides.filter(slide => slide._id.equals(currSlideId));
    if(!foundSlide[0]) return res.status(404).json({ message: "The slide ID does not exist"});

    if(presentation.isPrivate) {
        const group = await Group.findById(presentation.groupId);
        if (group.owner_id != req.userId && !group.co_owner_id.includes(req.userId)) {
            return res.status(401).json({ message: "Requested owner or coowner role of group to edit this group presentation"});
        }
    }
    else {
        if (!presentation.createdBy.equals(req.userId) && !presentation.collaborators.includes(req.userId)) {
            return res.status(401).json({ message: "Requested owner/collaborator role of this public presentation"});
        }
    }
    
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
   
    // The check whether the presentation exist or not is done in the Middle ware function
    
    const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
        slides: null,
        currentSlide: null
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}

// Answer question of multiple choice slide in both public and private presentation
export const answerSlideQuestion = async (req, res) => {
    const { presentationId, answerId } = req.body; 
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation does not exist"});
    if(!presentation.isPresenting) return res.status(403).json({ message: "This presentation is not presenting"});
    if(presentation.currentSlide.slideType != "multi") return res.status(403).json({ message: "The current presenting slide is not a mutiple choice slide"});
    
    if(req.userId) {
        let answeredUser = presentation.currentSlide.answeredUser.filter(userId => userId.equals(req.userId));
        if(answeredUser[0]) return res.status(403).json({ message: "You have answered this question"});
    }

    let foundAns = presentation.currentSlide.answers.filter(ans => ans._id.equals(answerId));
    if(!foundAns[0]) return res.status(403).json({ message: "The answer ID does not exist in the current presenting presentation"});
    
    // if this is a group presentation
    if(presentation.isPrivate) {
        // Check whether user is member or coowner or owner of group
        const user = await User.findById(req.userId);
        const roleOfUser = user.roles;
        let index1 =  roleOfUser.owner.indexOf(presentation.groupId);
        let index2 =  roleOfUser.co_owner.indexOf(presentation.groupId);
        let index3 =  roleOfUser.member.indexOf(presentation.groupId);
        if (index1 <= -1 && index2 <= -1 && index3 <= -1) {
            return res.status(403).json({ message: "This user has to be a member/coowner/owner of this group to join the group presentation"});
        }

        presentation.currentSlide.answers.map(ans =>{ 
            if (ans._id.equals(answerId)) {
                ans.count += 1;
                ans.answersList.push({
                    userId: req.userId,
                    name: req.userFullname,
                    answeredAt: new Date()
                });
            }
        });
    }
    else {
        // This is a public presentation
        // Increase count in the currentSlide property and in the Presentation.slides[index]
        presentation.currentSlide.answers.map(ans =>{ 
            if (ans._id.equals(answerId)) {
                ans.count += 1;
            }
        });
    }

    // add user id to the answered User if user login
    if(req.userId) {
        presentation.currentSlide.answeredUser.push(req.userId);
    }

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

export const startPresent = async (req, res) => {
    const {presentationId } = req.body; 
   
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation does not exist"});
    if(presentation.isPresenting) return res.status(403).json({ message: "Presentation is presenting now"});
    
    // Handle group presentation presenting
    if(presentation.isPrivate){
        const group = await Group.findById(presentation.groupId);
        if (group.owner_id != req.userId && !group.co_owner_id.includes(req.userId)) {
            return res.status(401).json({ message: "Requested owner or coowner role of group to start presenting for group presentation"});
        }

        const groupPresentingPresentation = await Presentation.findOne({
            groupId: presentation.groupId,
            isPresenting: true
        });

        if (groupPresentingPresentation) 
            return res.status(403).json({
                status: 'failed',
                message: "There is another presenting presentation in this group",
                data: {
                    groupPresentingPresentation
                }
            });
    }
    
    // Handle public presentation presenting
    if (!presentation.createdBy.equals(req.userId)) {
        return res.status(401).json({ message: "Requested owner role of this public presentation"});
    }
    const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
        isPresenting: true
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}

export const listAnswersOfSlide = async (req, res) => {
    const {presentationId , slideId} = req.params; 
   
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation does not exist"});
    if(!presentation.isPrivate) return res.status(403).json({ message: "This presentation is not a group presentation"});

    let foundSlide = presentation.slides.filter(slide => slide._id.equals(slideId));
    if(!foundSlide[0]) return res.status(404).json({ message: "The slide ID does not exist in the presentation"});
    if(foundSlide[0].slideType != "multi") return res.status(403).json({ message: "The slide is not a mutiple choice slide"});
    
    foundSlide[0].answers.map(answer => answer.answersList.map(ans => ans.answerContent = answer.answer));
    const answerLists = foundSlide[0].answers.map(answer => answer.answersList)
    const answers = [...new Set(answerLists.flat())];
    res.status(200).json({
        status: 'success',
        data: { 
            answers
        }
    })
}

export const stopPresent = async (req, res) => {
    const {presentationId } = req.body; 
   
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation does not exist"});
    if(!presentation.isPresenting) return res.status(403).json({ message: "Presentation is not presenting"});
    
    if(presentation.isPrivate) {
        const group = await Group.findById(presentation.groupId);
        if (group.owner_id != req.userId && !group.co_owner_id.includes(req.userId)) {
            return res.status(401).json({ message: "Requested owner or coowner role of group to stop presenting for this group presentation"});
        }
    }
    else {
        if (!presentation.createdBy.equals(req.userId)) {
            return res.status(401).json({ message: "Requested owner role of this public presentation"});
        }
    }

    const updatedPresentation = await Presentation.findByIdAndUpdate(presentationId, {
        isPresenting: false
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}

export const isPresenting = async (req, res) => {
    const {presentationId } = req.params; 
   
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation does not exist"});

    res.status(200).json({
        status: 'success',
        data: {
            isPresenting:  presentation.isPresenting
        }
    })
}

export const isGroupPresenting = async (req, res) => {
    const { groupId } = req.params; 
    
    const group = await Group.findById(groupId);
    if(!group) return res.status(404).json({ message: "Group doesn't exist"});

    const groupPresentingPresentation = await Presentation.find({
        groupId: groupId,
        isPresenting: true
    })

    let isPresenting = false;
    if (groupPresentingPresentation[0]) isPresenting = true;

    res.status(200).json({
        status: 'success',
        data: {
            isPresenting:  isPresenting,
            groupPresentingPresentation
        }
    })
}

export const createPrivatePresentation = async (req, res) => {
    const {name, groupId} = req.body;
    const alreadyPresentationExist = await Presentation.findOne({name: name});
    if(alreadyPresentationExist) return res.status(403).json({ message: "Presentation name already exists"});

    const group = await Group.findById(groupId);
    if(!group) return res.status(404).json({ message: "Group doesn't exist"});

    // Create new presentation with a default slide and set the default to be the current presented slide
    const newPresentation = new Presentation();
    newPresentation.name = name;
    newPresentation.groupId = groupId;
    newPresentation.createdBy = req.userId;
    newPresentation.isPrivate = true
    newPresentation.slides.push({
        "question": "Sample Question",
        "answers": [
            {
                "answer": "Sample Answer",
                "count": 0
            }
        ],
        "chartType": "bar",
        "slideType": "multi"
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
