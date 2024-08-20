const express=require("express");
const {checkForAuth}=require("../middleware/checkAuth");
const router=express.Router();
const path=require("path");
const Order=require("../model/order");
const Product=require("../model/product");
const User=require("../model/user");
const {addToCart,showCart,removeFromCart}=require("../controllers/cart");

router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.route("")
.get(checkForAuth,showCart)
.post(checkForAuth,addToCart);

router.route("/remove")
.post(checkForAuth,removeFromCart);

module.exports=router;