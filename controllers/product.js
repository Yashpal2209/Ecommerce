const User=require("../model/user");
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser");
const Product=require("../controllers/product");

function createProduct(req,res){
    try{
        const newProduct=Product.create({
            title:req.body.title,
            price:req.body.price,
            quantity:req.body.quantity,
            description:req.body.description,
            image:`/uploads/${file.filename}`,
            seller:req.user._id,
        })
    }catch(error){
        res.render("home",{
            user:req.user,
            error:error.message,
        });
    }
    res.render("home",{
        user:req.user,
    });
}

module.exports={
    createProduct
};