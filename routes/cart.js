const express=require("express");
const {checkForAuth}=require("../middleware/checkAuth");
const router=express.Router();
const path=require("path");
const Order=require("../model/order");
const Product=require("../model/product");
const User=require("../model/user");
const {addToCart,showCart,removeFromCart,updateCart,removeAll,buyOne}=require("../controllers/cart");

router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.route("")//route at cart page
.get(checkForAuth,showCart)//to show cart to a user
.post(checkForAuth,addToCart)//to add some product to cart
.patch(checkForAuth,updateCart);//to update cart means increasing the quantity of products

router.route("/remove")//to remove 
.post(checkForAuth,removeFromCart);//remove product from cart

router.route("/buyall")//to buy all products in cart
.post(checkForAuth,removeAll);//means to remove all product from cart

router.route("/buyOne")
.post(checkForAuth,buyOne);//to buy only one product

module.exports=router;