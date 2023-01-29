import Collection from '../models/collectionSchema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utils/customError.js'

export const createCollection = asyncHandler( async (req,res) => {
    const {name} = req.body;
    if(!name){
        throw new CustomError("Collection name is required", 400);
    }

    //adding the collection to the databse

    const collection = await Collection.create({
        name: name
    });

    res.status(200),json({
        success: true,
        message: "Collection created!",
        collection
    });
})

export const updateCollection = asyncHandler( async (req, res) => {
    
    //existing value to be updated -- identifying by its id

    const {id: collectionId} = req.params;
    
    //new value to be updated

    const {name} = req.body;
    
    if(!name){
        throw new CustomError("Collection name is required", 400);
    }

    //updating the collection to the databse

    let updatedCollection = await Collection.findByIdAndUpdate(collectionId,
         {
            //what you wnat to update
            name
         },
         {
            // in the response return the new value
            new: true,
            //running the validations
            runValidators: true
         }
    )
    if(!updatedCollection){
        throw new CustomError("Collection not found",400);
    }
    res.status(200),json({
        success: true,
        message: "Collection updated!",
        updateCollection
    });
});


export const deleteCollection = asyncHandler(async(req, res) =>{
    const{id: collectionId} = req.params;

    const collectionToDelete = await Collection.findByIdAndDelete(collectionId);

    if(!collectionToDelete){
        throw new CustomError("Collection not found to delete", 400);
    }
    res.status(200).json({
        success: true,
        message: "Collection deleted successfully",
        collectionToDelete
    });
});


export const getAllCollections = asyncHandler( async(req, res) => {
    const collections  = await Collection.find();
    if(!collections){
        throw new CustomError("No collection found", 400);
    }
    res.status(200).json({
        success: true,
        collections
    });
});