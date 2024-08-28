
function checkForAdmin(req,res,next){
    if(!req.user || req.user.role!="admin"){
        return res.redirect("/");
    }
    next();
}


module.exports={
    checkForAdmin,
}