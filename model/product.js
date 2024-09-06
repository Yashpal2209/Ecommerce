//product collection

const mongoose=require("mongoose");
const User=require("./user");
const prodSchema=new mongoose.Schema({
    _id:{
        type:Number,
        default:Date.now(),
    },
    imageURL:{
        type:String,
    },
    name:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    seller:{
        type:String,
        ref:User,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    }
},{timestamps:true});

const Product=mongoose.model("product",prodSchema);

module.exports=Product;
