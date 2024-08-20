const express=require("express");
const path=require("path");
const {checkForAuth}=require("./middleware/checkAuth");
const app=express();
const userroute=require("./routes/user.js");
const productroute=require("./routes/product.js");
const orderroute=require("./routes/order.js");
const cartroute=require("./routes/cart.js");
const port=3000;
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const popup = require('node-popup')

mongoose.connect("mongodb://localhost:27017/ecommerce")

.then(()=>{
    console.log("Connected to MongoDB");
});


app.set("views",path.resolve('views'));

app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.set('view engine',"ejs");

app.use("/",productroute);

app.use("/",userroute);

app.use("/cart",cartroute);

app.use("/order",orderroute);

app.use(cookieParser());

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
 });