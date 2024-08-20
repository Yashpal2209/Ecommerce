const Cart=require("../model/cart");
const Product=require("../model/product");
const mongoose=require("mongoose");

async function addToCart(req,res){
    id=req.body.id;
    console.log(req.user.id);
    const cartp=await Cart.find({productId:id});
    if(cartp.length>0){
        return res.send(JSON.stringify({message:"Product already in cart"}));
    }
    const result=await Cart.create({
        productId:id,
        user:req.user.id,
    });
    console.log(result);
    return res.send(JSON.stringify({message:"addded To cart"}));
}


async function showCart(req,res){
    const result1=await Cart.find({});
    const result=result1.filter((item)=>{return item.user==req.user.id})
    console.log(result);
    const productIds=result.map((item)=>item.productId);
    const products=await Product.find({_id:{$in:productIds}});
    
    res.render("cart",{
        user:req.user,
        products:products,
    });

}

async function removeFromCart(req,res){
    const id=req.body.id;
    console.log(id);
    const result=await Cart.deleteMany({productId:id});
    if(result){
        return res.send(JSON.stringify({message:"Removed from cart"}));
    }
    return res.send(JSON.stringify({message:"Failed to remove from cart"}));
}

module.exports={
    addToCart,
    showCart,
    removeFromCart,
}