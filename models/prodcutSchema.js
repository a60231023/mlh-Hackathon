import mongoose from "mongoose";

//individual product
const productSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true, "Please provide a category name"],
            trim : true,
            maxLength : [120, "collection name cannote be more than 120 characters"]
        }
    },
    {
        timestamps : true
    }
);

export default mongoose.model("Product", productSchema)