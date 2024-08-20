const express=require("express");

const router=express.Router();

const {createUser,verifyUser,logout,forgetPasssword,resetPassword}=require("../controllers/user");

const {checkForAuth}=require("../middleware/checkAuth");

router.route("/signin")
.get((req,res)=>{
    res.render("signin");
})
.post(verifyUser);


console.log("hii");

router.route("/signup")
.get((req,res)=>{
    res.render("signup");
})
.post(
    createUser    
);

router.route("/logout")
.get(
    logout
);

router.route("/forgetPassword")
.get((req,res)=>{
    res.render("forpass");
})
.post(
    forgetPasssword
);

router.route("/resetPassword")
.get(checkForAuth,(req,res)=>{
    res.render("resetpass",{
        user:req.user,
    });
})
.post(checkForAuth,resetPassword);


module.exports=router;
