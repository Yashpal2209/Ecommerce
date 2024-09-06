//order collection

const mongoose=require("mongoose");
const User=require("./user");
const Product=require("./product");

const orderSchema=new mongoose.Schema({
    _id:{
        type:Number,
        default:Date.now(),
    },
    user:{
        type: Number,
        ref:User,
        required:true,
    },
    products:[
        {
            product:{
                type: Number,
                ref:Product,
            },
            quantity:Number,
            price:Number,
        }
    ],
    totalPrice:{
        type:Number,
    },
    status:{
        type:String,
        enum:["Pending", "Shipped", "Delivered"],
        default:"Pending",
    },
    deliveredAt:{
        type:Date,
    },
    cancelledAt:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    updatedAt:{
        type:Date,
    },
 },{timestamps:true});


const Order=mongoose.model("order",orderSchema);

module.exports=Order;