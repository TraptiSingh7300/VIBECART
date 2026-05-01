import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      quantity:{
        type:Number,
        required:true
      }
    },
  ],
  amount:{type:Number,require:true},
  tax:{type:Number,require:true},
  shipping:{type:Number,require:true},
  currency:{type:String,default:"INR"},
  status:{type:String,enum:["Pending","Paid","Failed"],default:"Pending"},

  razorpayOrderId:{type:String},
  razorpayPaymentId:{type:String},
  razorpaySignature:{type:String},
},{timestamps:true});

export const Order = mongoose.model("Order",orderSchema)
