import Product from "../models/prodcutSchema.js"
import formidable from "formidable"
import fs from 'fs'
import {deleteFile, s3FileUpload} from "../services/imageUpload.js"
import Mongoose from 'mongoose'
import asyncHandler from "../services/asyncHandler.js"
import CustomError from "../utils/customError,js"
import config from "../config/index.js"


// add product to the aws and save the link to the db

export const addProduct = asyncHandler(async(req, res) => {
    const form = formidable({
        multiples: true,
        keepExtensions: true
    });
    form.parse(req, async function (err, fields, files){
        try{
            if(err){
                throw new CustomError(err.message || "something went wrong", 500);
            }
            let productId = new Mongoose.Types.ObjectId().toHexString();

            console.log(fields, files);
            //check for fields
            if(!fields.name || !fields.price || !fields.description || !fields.collectionId){
                throw new CustomError("All fields are required", 500);
            }
            // handling images

            let imageArrayResp = Promise.all(
                // object.keys will turn the object into array.. now this array is also an array of object which will have properties.. we are taking out each object from the array by the means of filekey and iterating through the whole array one by one

                Object.keys(files).map(async (filekey, index) => {

                    // taking out each element which is an object stored at a filekey- index of the files array

                    const element = files[filekey];

                    const data = fs.readFileSync(element.filepath);
                     
                    const upload = await s3FileUpload({
                        bucketName: config.S3_BUCKET_NAME,
                        key: `prodcuts/${productId}/photo_${index + 1}.png`,
                        body: data,
                        contentType: element.mimetype
                    })
                    return{
                        secure_url:upload.Location
                    }
                })
            );

            let imgArray = await imageArrayResp;

            const product = await Product.create({
                _id: productId,
                photos: imgArray,
                ...fields,
            })

            if(!product){
                throw new CustomError("Product was not created", 400);
            }
            res.status(200).json({
                success: true,
                product
            });

        }catch (error){
            return res.status(500).json({
                success: false,
                message: error.message || "something went wrong , will find it -- don't worry"
            });
        }
    })
});


// retrive all  the prodcuts from the db 
export const getAllProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({});
    if(!products){
        throw new CustomError("NO products found", 404);
    }
    res.status(200).json({
        success: true,
        products
    });
})

// retrive the prodcuts from the db by id

export const getProductsById = asyncHandler(async(req, res) => {
    const {id: productId} = req.params;
    const product = await Product.findById(productId);
    if(!product){
        throw new CustomError("NO products found", 404);
    }
    res.status(200).json({
        success: true,
        product
    });
})

