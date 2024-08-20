const Product=require("../model/product");
const Order=require("../model/order");
const User=require("../model/user");
const Cart=require("../model/cart");

async function showOrder(req,res){
    try{
        const id=req.query.product;
        const product=await Product.findById(id);
        const user=await User.find({_id:product.seller});
        product.seller=user[0].name;
        return res.render("placeOrder",{
            user:req.user,
            product:product
        });
    }
    catch(error){
        console.log(error);
    }
}

async function createOrder(req,res){
    const quantity=req.body.quantity;
    const id=req.body.id;
    try{
        const product=await Product.findOne({_id:id});
        if(product.quantity<quantity){
            return res.render("placeOrder",{
                user:req.user,
                product:product,
                error:"Not enough stock",
            });
        }
        await Order.create({
            user:req.user.id,
            products:[
                {
                    product:id,
                    quantity:quantity,
                    price:product.price,
                }
            ],
            totalPrice:quantity*product.price,
            status:"Pending",
        });
        product.quantity=product.quantity-quantity;
        await product.save();
        await Cart.deleteMany({productId:id});
        res.redirect("/");
    }catch(error){
        console.log(error);
        return res.redirect("/cart");
    }
}

async function myOrders(req,res){
    console.log(req.user);
    const orders=await Order.find({user:req.user.id}).populate("products.product").sort({date:-1});
    console.log(orders);
    res.render("myOrders",{
        user:req.user,
        orders:orders
    });
}

module.exports={
    showOrder,
    createOrder,
    myOrders,
}