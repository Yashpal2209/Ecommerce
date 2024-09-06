//cart collection

const mongoose=require("mongoose");
const Order=require("./order");
const Product=require("./product");
const User=require("./user");

const cartSchema=new mongoose.Schema({
    productId:{
        type: Number,
        ref:Product,
        required:true,
    },
    user:{
        type:Number,
        ref:User,
        required:true,
    }
});

const Cart=mongoose.model("cart",cartSchema);

module.exports=Cart;