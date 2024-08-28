const express=require("express");

const router=express.Router();

const {createUser,verifyUser,logout,forgetPasssword,resetPassword,showresetform,verifyEmail}=require("../controllers/user");

// const {checkForAuth}=require("../middleware/checkAuth");

router.route("/signin")
.get((req,res)=>{
    res.render("signin");
})
.post(verifyUser);

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

// router.route("/resetPassword")
// .get((req,res)=>{
//     res.render("resetpass",{
//         user:req.user,
//     });
// })
// .post(resetPassword);

router.route("/reset")
.get(showresetform)
.post(resetPassword);

router.route("/verify")
.get(verifyEmail);


module.exports=router;
