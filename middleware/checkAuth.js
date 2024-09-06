const jwt=require("jsonwebtoken");
const Product=require("../model/product");

// Middleware to check if user is authenticated before accessing protected routes.
function checkForAuth(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.redirect("/");
    }
    jwt.verify(token,"mysecretkey",async (err,decodedToken)=>{
        if(err){
            return res.redirect("/");
        }
        req.user=decodedToken;
        next();//if verified then can proceed
    });
}

module.exports={
    checkForAuth,
}