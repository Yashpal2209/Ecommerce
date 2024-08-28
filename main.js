const express=require("express");
const path=require("path");
const app=express();
const userroute=require("./routes/user.js");
const productroute=require("./routes/product.js");
const orderroute=require("./routes/order.js");
const cartroute=require("./routes/cart.js");
const adminroute=require("./routes/admin.js");
const port=3000;
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const popup = require('node-popup')

const sqlconnection=require("./mysqlconnect.js");

// mongoose.connect("mongodb://localhost:27017/ecommerce")
// .then(()=>{
//     console.log("Connected to MongoDB");
// });

// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100 
// });

// app.use(limiter);


app.set("views",path.resolve('views'));

app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.set('view engine',"ejs");

app.use("/",productroute);

app.use("/",userroute);

app.use("/cart",cartroute);

app.use("/order",orderroute);

app.use("/admin",adminroute);

app.use(cookieParser());

app.get('*', (req, res) => {
    return res.render("error.ejs");
    return res.status(404).send('Page not found')
} )

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
 });