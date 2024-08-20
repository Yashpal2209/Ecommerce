const jwt=require("jsonwebtoken");
const Product=require("../model/product");
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
        next();
    });
}

module.exports={
    checkForAuth,
}