const Product=require("../model/product");

async function getData(req,res,next){
    console.log("hii");
    try {
        const result = await Product.find();
        req.result = result;
        next();
    } catch (fetchError) {
        console.error("Error fetching products:", fetchError);
        res.status(500).send("Internal Server Error");
    }
    next();
}

module.exports={
    getData,
};