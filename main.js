const express=require("express");
const path=require("path");
const app=express();
const userroute=require("./routes/user.js");
const productroute=require("./routes/product.js");
const orderroute=require("./routes/order.js");
const cartroute=require("./routes/cart.js");
const adminroute=require("./routes/admin.js");
const port=3000;

//this code is to connect mongoose
// const mongoose=require("mongoose");

// const sqlconnection=require("./mysqlconnect.js");
// const {checkForAuth}=require("./middleware/checkAuth.js")
// mongoose.connect("mongodb://localhost:27017/ecommerce")
// .then(()=>{
//     console.log("Connected to MongoDB");
// });


const cookieParser=require("cookie-parser");//to parse cookies

app.set("views",path.resolve('views'));//to make views available for direct use

app.use(express.static(path.join(__dirname,"public")));//make public folder static means path of files in this can be given after /public/

app.use(express.urlencoded({extended:true}));//to parse the html form

app.use(express.json());//to use json data 

app.set('view engine',"ejs");//setting template engine

//creating routes
app.use("/",productroute);
app.use("/",userroute);
app.use("/cart",cartroute);
app.use("/order",orderroute);
app.use("/admin",adminroute);


//handling 404 errors
app.get('*', (req, res) => {
    return res.redirect("/");
} )

//starting server we can say it is just like someone is listening for the request
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
 });