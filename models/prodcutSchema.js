import mongoose from "mongoose";

//individual product
const productSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true, "Please provide a prodcut name"],
            trim : true,
            maxLength : [120, "product name cannote be more than 120 characters"]
        },
        price: {
            type: Number,
            required: [true, "Please provide a product price"],
            maxLength: [6, "Product price should not exceed 6 digit"]
        },
        description: {
            type: String,

        },
        photos: [
            {
                secure_url:{
                    type: String,
                    required: true
                }
            }
        ],
        stock: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        //reference of collection schema
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection"
        }
    },
    {
        timestamps : true
    }
);

export default mongoose.model("Product", productSchema)