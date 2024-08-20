const express=require("express");
const {checkForAuth}=require("../middleware/checkAuth");
const cookieParser=require("cookie-parser");
const multer=require("multer");
const router=express.Router();
const path=require("path");
const {createProduct}=require("../controllers/product");     
const User=require("../model/user");
const Product=require("../model/product");
const jwt=require("jsonwebtoken");
const {getData}=require("../middleware/getData");

router.use(cookieParser())
router.use(express.urlencoded({extended:true}));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload=multer({storage:storage});

router.route("")
.get(async (req,res)=>{
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||2;
    try{
        const totalItems=await Product.countDocuments();
        const products=await Product.find({}).skip((page-1)*limit).limit(limit);
        
        const token=req.cookies.token;
        if(!token){
            return res.render("home",{
                result:products,
                totalItems:totalItems,
                totalPages:Math.ceil(totalItems/limit),
                currentPage:page,
                error:"Please login and sign in first"
            });
        }
        jwt.verify(token,"mysecretkey",async (err,decodedToken)=>{
            if(err){
                return res.render("home",{
                    result:products,
                    totalItems:totalItems,
                    totalPages:Math.ceil(totalItems/limit),
                    currentPage:page,
                    error:"Invalid Login id"
                });
            }
            res.render("home",{
                user:decodedToken,
                result:products,
                totalItems:totalItems,
                totalPages:Math.ceil(totalItems/limit),
                currentPage:page,
            });
        });
    
    }catch(error){
        res.status(500).json({message:error.message});
    }
    
})
.post();

router.route("/createProduct")
.get(checkForAuth,(req,res)=>{
    res.render("products",{
        user:req.user,
    });
})
.post(upload.single("productImage"),async (req,res)=>{
    const token=req.cookies.token;
    if(!token){
        return res.render("home",{
            error:"Please login and sign in first"
        });
    }
    let decodedToken1={};
    try{
        await jwt.verify(token,"mysecretkey",(err,decodedToken)=>{
            if(err){
                return res.render("home",
                    {error:"Invalid Login id"}
                );
            }
            decodedToken1=decodedToken;
            const newProduct=Product.create({
                name:req.body.productName,
                price:req.body.price,
                quantity:req.body.quantity,
                description:req.body.description,
                imageURL:`/uploads/${req.file.filename}`,
                seller:decodedToken.id,
            });
        })
    }catch(error){
        return res.render("home",{
            user:decodedToken1,
            error:error.message,
        })
    }
    return res.redirect("/");
});

module.exports=router;