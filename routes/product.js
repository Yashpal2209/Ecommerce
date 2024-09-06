const express=require("express");
const {checkForAuth}=require("../middleware/checkAuth");
const cookieParser=require("cookie-parser");
const multer=require("multer");
const router=express.Router();
const path=require("path");   
const {showAllProducts}=require("../controllers/product");
const jwt=require("jsonwebtoken");
const connectionrequest=require("../mysqlconnect");


router.use(cookieParser())
router.use(express.urlencoded({extended:true}));

//to save file and rename that 
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

//multer middleware to handle file upload
const upload=multer({storage:storage});

//home page route
router.route("/")
.get(async (req,res)=>{
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||4;
    const offset=(page-1)*limit;
    try{

        // const sqlconnection = await connectionrequest();

        const token=req.cookies.token;//get token

        //case when user is not verified 
        if (!token) {
            const {totalItems,products}=await showAllProducts(limit,offset);//all products
            return res.render("home", {
                result: products,
                totalItems: totalItems[0].count,
                totalPages: Math.ceil(totalItems[0].count / limit),
                currentPage: page,
                error: "Please login and sign in first"
            });
        }
        
        jwt.verify(token, "mysecretkey", async (err, decodedToken) => {
            
            if (err) {
                const {totalItems,products}=await showAllProducts(limit,offset);//all products
                return res.render("home", {
                    result: products,
                    totalItems: totalItems[0].count,
                    totalPages: Math.ceil(totalItems[0].count / limit),
                    currentPage: page,
                    error: "Invalid Login id"
                });
            }
            //get all products for logged in user
            const {totalItems,products}=await showAllProducts(limit,offset,decodedToken.id);//without products of this particular user
        
            res.render("home", {
                user: decodedToken,
                result: products,
                totalItems: totalItems[0].count,
                totalPages: Math.ceil(totalItems[0].count / limit),
                currentPage: page,
            });
        });
    
    }catch(error){
        res.status(500).json({message:error.message});
    }
    
});


router.route("/createProduct")
.get(checkForAuth,(req,res)=>{//form for product creation
    res.render("products",{
        user:req.user,
    });
})
.post(upload.single("productImage"),async (req,res)=>{//for getting form data and creating the product
    const token=req.cookies.token;
    if(!token){//if not verified
        return res.render("home",{
            error:"Please login and sign in first"
        });
    }
    let decodedToken1={};
    //if verified
    try{
        await jwt.verify(token,"mysecretkey",async (err,decodedToken)=>{
            if(err){
                return res.render("home",
                    {error:"Invalid Login id"}
                );
            }
            decodedToken1=decodedToken;

            const sqlconnection=await connectionrequest();

            const sqlquery="INSERT INTO products(imageURL,name,quantity,description,price,seller_id) VALUES(?,?,?,?,?,?)";
            
            const values=[`/uploads/${req.file.filename}`,req.body.productName,req.body.quantity,req.body.description,req.body.price,decodedToken.id];

            
            await new Promise((resolve,reject)=>{
                sqlconnection.query(sqlquery,values,async(err,results)=>{
                    if(err){
                        console.error('Error adding product:', err);
                        return res.render("home",{
                            error:"Error adding product"
                        });
                    }
                    res.redirect("/");
                })
            });

            sqlconnection.end();
        })
    }catch(error){//to handle errors
        return res.render("home",{
            user:decodedToken1,
            error:error.message,
        })
    }
    return res.redirect("/");
});

module.exports=router;