const User=require("../model/user");
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser");
const nodemailer = require("nodemailer");
const connectionrequest=require("../mysqlconnect");
const crypto=require("crypto")
const bcrypt=require("bcrypt");
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_USERNAME, 
        pass:  process.env.NODEMAILER_PASSWORD
    }
});

async function hashPassword(password) {
    const saltRounds = 10; // You can adjust the salt rounds, higher means more security but slower performance
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function comparePassword(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
}
  
async function createUser(req,res){
    try{
        const sqlconnection =await connectionrequest();
        if(!sqlconnection){
            console.log("No connection");
            return res.render("home", { error: "No connection" });
        }
        const q=`INSERT INTO users (name,email,password,phone,address) VALUES (?,?,?,?,?);`;
        const hashedPassword=await hashPassword(req.body.password);
        // if(req.body.fullName.trim()=="" || req.body.email.trim()=="" || req.body.password.trim()=="" || req.body.phoneNumber.trim()=="" || req.body.address.trim()==""){
        //     return res.render("signup", { error: "Please fill all fields." });
        // }
        const values=[req.body.fullName, req.body.email, hashedPassword, parseInt(req.body.phoneNumber), req.body.address];    
        await sqlconnection.promise().query(q,values)
        .then(async ()=>{
                console.log("creating user");
                const verifyToken = crypto.randomBytes(32).toString('hex');
                const results=await sqlconnection.promise().query(`SELECT * FROM users where email=?`,[req.body.email]);
                console.log(results[0][0].id);
                await sqlconnection.promise().execute(`INSERT INTO verifyUsers(userId,token) Values(?,?)`,[results[0][0].id,verifyToken]);
                console.log("created");
                const link=`http://localhost:3000/verify/?token=${verifyToken}&id=${results[0][0].id}`;
                const message = {
                    from: "yashfatehgarh2017@gmail.com",
                    to: req.body.email,
                    subject: "Verify Your Identity",
                    text: "You are registered Successfully.",
                    html: `<p>You are registered Successfully. Click the following link to verify your identity:</p><a href="${link}">Verify Identity</a>`
                };
                        
                await transporter.sendMail(message, function(err, info) {
                    if (err) {
                        console.log("Error occurred: ", err.message);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
                
                console.log("done");
            }
        ).catch((err)=>{
            console.error('Error creating user:', err);
            return res.render("home", { error: err.message });
        });
        sqlconnection.end();
        
    }
    catch(error){
        console.log('Error creating user:', error);
        return res.render("home",
            {
            error:error.message,
            }
        );
    }

    return res.render("home",{
        message:"Accounted created Successfully .Please Login Now"
    });
    
}

async function verifyUser(req,res){
    const sqlconnection =await connectionrequest();
    const q=`SELECT * FROM users WHERE email=?`;
    const values=[req.body.email];
    const [results]=await sqlconnection.promise().query(q,values);
    if(results.length==0){
        return res.render("signin",{
            error:"Invalid Email"
        });
    }
    const isMatch = await comparePassword(req.body.password, results[0].password);
    if(!isMatch){
        return res.redirect("/");
    }
    if(!results[0].isVerified){
        return res.render("home",{
            error:"Please verify your email first"
        })
    }
    const payload={
        id:results[0].id,
        name:results[0].name,
        email:results[0].email,
        phone:results[0].phone,
        address:results[0].address,
        role:results[0].role,
    }
    const id1=await jwt.sign(payload,"mysecretkey",{expiresIn:'1h'});
    res.cookie("token",id1);
    sqlconnection.end();
    return res.redirect("/");
}

async function logout(req,res){
    res.clearCookie("token");
    return res.redirect("/");
}

async function forgetPasssword(req,res){
    const sqlconnection =await connectionrequest();
    const q=`SELECT * FROM users WHERE email=?`;
    const values=[req.body.email];

    await new Promise((resolve,reject)=>{ sqlconnection.query(q,values,async (err, results) => {
        if(err){
            reject("Invalid Email");
            return res.render("home",{
                error:"Invalid email"
            });
        }
        // console.log(results[0].id);
        // let newPassword=Math.floor(1000 + Math.random() * 9000);
        const resetToken = crypto.randomBytes(32).toString('hex');
        const [result]=await sqlconnection.promise().query(`SELECT * FROM resetPassword where userId=?`,[results[0].id]);
        
        if(result.length==0){
            await sqlconnection.promise().query(`INSERT INTO resetPassword(userId,token,expiresAt) Values(?,?,?)`,[results[0].id,resetToken,Date.now()+360000]);
        }else{
            await sqlconnection.promise().query(`UPDATE resetPassword SET token=?, expiresAt=? WHERE userId=?`,[resetToken,Date.now()+360000,results[0].id]);
        }
        // await sqlconnection.promise().query(`INSERT INTO resetPassword(userId,token,expiresAt) Values(?,?,?)`,[results[0].id,resetToken,Date.now()+360000]);

        const resetLink=`http://localhost:3000/reset/?token=${resetToken}&id=${results[0].id}`;

        // await new Promise((resolve,reject)=>{sqlconnection.query(`UPDATE users SET password=? WHERE email=?`,[newPassword,req.body.email],(err,results) => {
        //     if(err){
        //         console.error('Error updating password:', err);
        //         reject("Failed to update password");
        //     }
        //     resolve("Password updated successfully");
        // })
        // })

        const message = {
            from: "yashfatehgarh2017@gmail.com",
            to: req.body.email,
            subject: "Sending Email using Nodemailer with Gmail",
            text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
            html: `<p>You requested a password reset. Click the following link to reset your password:</p><a href="${resetLink}">Reset Password</a>`
        };
        
        await transporter.sendMail(message, function(err, info) {
            if (err) {
                console.log("Error occurred: ", err.message);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
        return res.redirect("/");
        
    })}
    )
}

async function resetPassword(req,res){
    const sqlconnection =await connectionrequest();
    const userId=req.body.userId;
    if(req.body.newpassword!==req.body.newpassword1){
        return res.render("resetpass",{
            user:req.user,
            error:"Passwords do not match"
        });
    }
    const hashedPassword=await hashPassword(req.body.newpassword);
    await sqlconnection.promise().query(`UPDATE users SET password=? WHERE id=?`,[hashedPassword,userId]);
    await sqlconnection.promise().query(`DELETE FROM resetPassword WHERE userId=?`,[req.query.token,userId]);
    sqlconnection.end();
    res.redirect("/signin");
};

async function showresetform(req,res){
    const token=req.query.token;
    const userId=req.query.id;
    const sqlconnection = await connectionrequest();
    const [resetPassword]=await sqlconnection.promise().query(`SELECT * FROM resetPassword WHERE token=? AND userId=?`,[token,userId]);
    
    if(resetPassword.length==0){
        console.log("hii");
        return res.render("home",{
            error:"PLease sign in or signup first"
        })
    }

    if(Number(resetPassword.expiresAt)<Date.now()){
        res.render("home",{
            error:"Please sign first"
        })
    }

    res.render("resetpass",{
        userId:userId,
    });


}

async function verifyEmail(req,res){
    const sqlconnection = await connectionrequest();
    const q=`SELECT * FROM verifyUsers WHERE token=? and userId=?`;
    const values=[req.query.token,req.query.id];
    console.log(values);
    const [results]=await sqlconnection.promise().query(q,values);
    if(results.length==0){
        return res.render("home",{
            error:"Invalid Link"
        });
    }
    await sqlconnection.promise().query(`UPDATE users SET isVerified=true WHERE id=?`,[req.query.id]);
    await sqlconnection.promise().query(`DELETE FROM verifyUsers where userId=?`,[req.query.id]);
    sqlconnection.end();
    return res.render("home",{
        message:"Email verified successfully.You can login now"
    })
 
}


module.exports={
    createUser,
    verifyUser,
    logout,
    forgetPasssword,
    resetPassword,
    showresetform,
    verifyEmail
}