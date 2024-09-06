const express=require("express");
const {checkForAuth}=require("../middleware/checkAuth");
const {checkForAdmin}=require("../middleware/checkAdmin");
const {showProducts,updateForm,updateDetails,deleteProduct,showAllOrders,updateStatus}=require("../controllers/admin");

const router=express.Router();//creating the router
const path=require("path");//to use path module

router.use(express.json());//to use json data
router.use(express.urlencoded({extended:false}));//for the form data

router.route("")//at admin page
.get(checkForAuth,checkForAdmin,showProducts)//get request to show all products of a particular user
.post(checkForAuth,checkForAdmin,updateDetails)//post request updarte the product details
.delete(checkForAuth,checkForAdmin,deleteProduct);//to delete or remove the product

router.route("/update")//at admin for updation
.get(checkForAuth,checkForAdmin,updateForm)//form to update detail of product by admin
.post(checkForAuth,checkForAdmin,updateStatus);//to update the status of particular order

router.route("/allorders")//all order page of admin
.get(checkForAuth,checkForAdmin,showAllOrders);//show all orders

module.exports=router;
