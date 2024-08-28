const express=require("express");
const {checkForAuth}=require("../middleware/checkAuth");
const {checkForAdmin}=require("../middleware/checkAdmin");
const {showProducts,updateForm,updateDetails,deleteProduct,showAllOrders,updateStatus}=require("../controllers/admin");

const router=express.Router();
const path=require("path");

router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.route("")
.get(checkForAuth,checkForAdmin,showProducts)
.post(checkForAuth,checkForAdmin,updateDetails)
.delete(checkForAuth,checkForAdmin,deleteProduct);

router.route("/update")
.get(checkForAuth,checkForAdmin,updateForm)
.post(checkForAuth,checkForAdmin,updateStatus);

router.route("/allorders")
.get(checkForAuth,checkForAdmin,showAllOrders);

module.exports=router;
