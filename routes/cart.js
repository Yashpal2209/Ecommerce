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

router.route("")
.get(checkForAuth,showCart)
.post(checkForAuth,addToCart)
.patch(checkForAuth,updateCart);

router.route("/remove")
.post(checkForAuth,removeFromCart);

router.route("/buyall")
.post(checkForAuth,removeAll);

router.route("/buyOne")
.post(checkForAuth,buyOne);

module.exports=router;