import mongoose, { mongo } from "mongoose";
import orderStatus from "../utils/orderStatus";
import paymentMode from "../utils/paymentMode";

const orderSchema = new mongoose.Schema(
    {
        products:{
            type: [
                {
                    productId:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true
                    },
                    count: Number,
                    price: Number
                }
            ],
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        coupon: String,
        transactionId: String,
        status: {
            type: String,
            enum: Object.values(orderStatus),
            default: orderStatus.ORDERED
        },
        paymentMode: {
            type: String,
            enum: Object.values(paymentMode),
            default: paymentMode.CASH
        }

    },
    {
        timestamps: true
    }
);
