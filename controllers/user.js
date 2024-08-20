const User=require("../model/user");
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser");
const nodemailer = require("nodemailer");

// Create a transporter using Gmail's SMTP server
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yashfatehgarh2017@gmail.com", // Replace with your Gmail email
        pass: "qifi ytbt zmhh dwsm"   // Replace with your Gmail password
    }
});

  
async function createUser(req,res){
    try{
        const user=await User.create({
            name:req.body.fullName,
            email:req.body.email,
            password:req.body.password,
            phone:req.body.phoneNumber,
            address:req.body.address,
        }).then(async ()=>{
            const message = {
                from: "yashfatehgarh2017@gmail.com",
                to: req.body.email,
                subject: "Sending Email using Nodemailer with Gmail",
                text: "You are registered Successfully."
            };
            
            await transporter.sendMail(message, function(err, info) {
                if (err) {
                    console.log("Error occurred: ", err.message);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
            console.log('User created successfully');
        });
    }
    catch(error){
        console.log('Error creating user:', error);
        return res.render("home",
            {
            error:error.message,
            }
        );
    }

    return res.redirect("/")
    
}

async function verifyUser(req,res){
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return res.redirect("/");
    }

    if(user.password!==req.body.password){
        return res.redirect("/");
    }
    let id=user._id;
    const payload={
        id:id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
    };
    const id1=jwt.sign(payload,"mysecretkey");
    res.cookie("token",id1);
    res.redirect("/");
}

async function logout(req,res){
    res.clearCookie("token");
    res.redirect("/");
}

async function forgetPasssword(req,res){
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return res.redirect("/");
    }
    let newPassword=Math.floor(1000 + Math.random() * 9000);
    user.password=newPassword;
    await user.save();
    const message = {
        from: "yashfatehgarh2017@gmail.com",
        to: req.body.email,
        subject: "Sending Email using Nodemailer with Gmail",
        text: "Your new password is: "+newPassword
    };
    
    await transporter.sendMail(message, function(err, info) {
        if (err) {
            console.log("Error occurred: ", err.message);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
    return res.redirect("/");
}

async function resetPassword(req,res){
    const email=req.user.email;
    const user=await User.findOne({email:email});
    console.log(user);
    if(!user){
        console.log("hii");
        return res.redirect("/");
    }
    if(user.password!==req.body.oldpassword){
        return res.render("resetpass",{
            user:req.user,
            error:"Old password is incorrect"
        });
    }
    if(req.body.newpassword!==req.body.newpassword1){
        return res.render("resetpass",{
            user:req.user,
            error:"New password is not same in both fields"
        });
    }
    
    if(user.oldpassword===req.body.newpassword){
        return res.render("resetpass",{
            user:req.user,
            error:"Old password and new password are same"
        });
    }

    user.password=req.body.newpassword;
    await user.save();
    return res.render("resetpass",{
        user:req.user,
        message:"Password Reset Successfully"
    });
};

module.exports={
    createUser,
    verifyUser,
    logout,
    forgetPasssword,
    resetPassword,
}