const express=require("express");

const router=express.Router();

const {createUser,verifyUser,logout,forgetPasssword,resetPassword,showresetform,verifyEmail}=require("../controllers/user");

// const {checkForAuth}=require("../middleware/checkAuth");

router.route("/signin")
.get((req,res)=>{//to show signin form
    res.render("signin");
})
.post(verifyUser);//to sign in

router.route("/signup")
.get((req,res)=>{//to show signup form
    res.render("signup");
})
.post(//to create user
    createUser    
);

router.route("/logout")//to logout
.get(
    logout
);

router.route("/forgetPassword")//in case of forget password
.get((req,res)=>{//to show form for password forget
    res.render("forpass");
})
.post(//to send mail for foget password
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
.get(showresetform)//to show reset form after verification  
.post(resetPassword);//to reset password

router.route("/verify")
.get(verifyEmail);//send email after signup for verification


module.exports=router;
