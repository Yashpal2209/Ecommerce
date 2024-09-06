const express=require("express");
const {checkForAuth}=require("../middleware/checkAuth");
const router=express.Router();
const path=require("path");
const Order=require("../model/order");
const Product=require("../model/product");
const User=require("../model/user");
const {showOrder,createOrder,myOrders}=require("../controllers/order");


router.use(express.json());
router.use(express.urlencoded({extended:true}));


//to show all orders of a user
router.route("")
.get(checkForAuth,myOrders);

// router.route("/place")
// .get(checkForAuth,showOrder)
// .post(checkForAuth,createOrder);


module.exports=router;