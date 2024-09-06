//user collection

const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    _id:{
        type:Number,
        required:true,
        default:Date.now(),
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    address:{
        type:String,
    }
},{timestamps:true});

const User=mongoose.model("user",userSchema);

module.exports=User;
