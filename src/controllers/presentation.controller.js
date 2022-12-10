import Presentation from "../models/Presentation.js";

export const getPresentations = async (req, res) => {
    const presentations = await Presentation.find();
    res.status(200).json({
        status: 'success',
        data: { 
            presentations
        }
    })
}

export const getPresentationById = async (req, res) => {
    const presentation = await Presentation.findById(req.params.presentationId);
    if(!presentation) return res.status(404).json({ message: "Presentation doesn't exist"});

    res.status(200).json({
        status: 'success',
        data: { 
            presentation
        }
    })
}

export const createPresentation = async (req, res) => {
    const alredyPresentationExist = await Presentation.findOne({ name: req.body.name});
    if(alredyPresentationExist) return res.status(400).json({ message: "Presentation already exists"});

    const newPresentation = new Presentation({name: req.body.name});
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

    const alredyPresentationExist = await Presentation.findOne({ name: newName});
    if(alredyPresentationExist) return res.status(400).json({ message: "This name already exists"});
    
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
    
    const existingSlides = presentation.slides;

    let newSlides;
    
    const updatedPresentation = await Presentation.findByIdAndUpdate(req.body.presentationId, {
        slides: newSlides
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            presentationUpdated
        }
    })
}

export const deleteAllSlides = async (req, res) => {
    const { slides, presentationId } = req.body; 
    const presentation = await Presentation.findById(presentationId);
    if(!presentation) return res.status(400).json({ message: "Presentation does not exist"});
    
    const existingSlides = presentation.slides;

    
    const updatedPresentation = await Presentation.findByIdAndUpdate(req.body.presentationId, {
        slides: null
    }, { new: true })
    res.status(200).json({
        status: 'success',
        data: { 
            updatedPresentation
        }
    })
}