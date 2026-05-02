import razorpayInstance from "../config/razorpay.js";
import crypto from "crypto";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, currency } = req.body;

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newOrder = new Order({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      currency,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.log("❌ Error in create order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       paymentFailed,
//     } = req.body;

//     if (!req.user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User not authenticated" });
//     }

//     const userId = req.user._id;

//     if (paymentFailed) {
//       const order = await Order.findOneAndUpdate(
//         { razorpayOrderId: razorpay_order_id },
//         { status: "Failed" },
//         { returnDocument: "after" },
//       );
//       return res.status(400).json({
//         success: false,
//         message: "Payment failed",
//         order,
//       });
//     }

//     const sign = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(sign)
//       .digest("hex");

//     if (expectedSignature === razorpay_signature) {
//       const order = await Order.findOneAndUpdate(
//         { razorpayOrderId: razorpay_order_id },
//         {
//           status: "Paid",
//           razorpayPaymentID: razorpay_payment_id,
//           razorpaySignature: razorpay_signature,
//         },
//         { returnDocument: "after" },
//       );

//       await Cart.findOneAndUpdate(
//         { userId },
//         { $set: { item: [], totalPrice: 0 } },
//       );

//       return res.json({ success: true, message: "Payment Successfull", order });
//     } else {
//       await Order.findOneAndUpdate(
//         { razorpayOrderId: razorpay_order_id },
//         { status: "Failed" },
//         { new: true },
//       );
//       return res
//         .status(400)
//         .json({ succecss: false, message: "Invalid Signature" });
//     }

//   } catch (error) {
//     console.log("❌ Error in verifying payment", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;

    // Safety check for Order ID
    if (!razorpay_order_id) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user._id;

    // 1. Handle Explicit Failure from Frontend
    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true } // Standardize to new: true
      );
      return res.status(400).json({
        success: false,
        message: "Payment failed or cancelled",
        order,
      });
    }

    // 2. Validate Signature for Success
    // Ensure all success parameters are present
    if (!razorpay_payment_id || !razorpay_signature) {
       return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // SUCCESS logic
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: "Paid",
          razorpayPaymentID: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        { new: true }
      );

      // Clear the cart
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { item: [], totalPrice: 0 } }
      );

      return res.json({ success: true, message: "Payment Successful", order });
    } else {
      // INVALID SIGNATURE logic
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true }
      );
      return res.status(400).json({ success: false, message: "Invalid Signature", order });
    }

  } catch (error) {
    console.log("❌ Error in verifying payment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrder=async(req,res)=>{
  try {
    const userId=req.user?._id || req.id;
    const orders=await Order.find({user:userId})
    .populate({path:"products.productId",select:"productName productPrice productImg"})
    .populate("user","firstName lastName email")

    res.status(200).json({
      success:true,
      count:orders.length,
      orders,
    })
  } catch (error) {
    console.error("Error fetching user orders:",error)
    res.status(500).json({message:error.message})
  }
}

export const getUserOrders=async(req,res)=>{
  try {
    const {userId}=req.params
    const orders = await Order.find({user:userId})
    .populate({
      path:"products.productId",
      select:"productName productPrice productImg"
    })
    .populate("user","firstName lastName email")

    res.status(200).json({
      success:true,
      count:orders.length,
      orders
    })
  } catch (error) {
    console.log("Error fetching user order : ",error)
    res.status(500).json({message:error.message})
  }
}

export const getAllOrdersAdmin=async(req,res)=>{
  try {
    const orders=await Order.find()
    .sort({createdAt:-1})
    .populate("user","name email")
    .populate("products.productId","productName productPrice")

    res.json({
      success:true,
      count:orders.length,
      orders
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:"Failed to fetch all orders",
      error:error.message
    })
  }
}