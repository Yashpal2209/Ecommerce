const Product=require("../model/product");
const Order=require("../model/order");
const User=require("../model/user");
const Cart=require("../model/cart");
const connectionrequest=require("../mysqlconnect");


async function showOrder(req,res){
    try{

        const sqlconnection=await connectionrequest();

        const id=req.query.product;

        const [product]=await sqlconnection.promise().query(`SELECT * FROM products where id=?`,[id]);
        
        const [user]=await sqlconnection.promise().query('SELECT * FROM users WHERE id=?',[product[0].seller_id]);
        // const product=await Product.findById(id);
        // const user=await User.find({_id:product.seller});
        
        product[0].seller_id=user[0].name;
        return res.render("placeOrder",{
            user:req.user,
            product:product[0]
        });
    }
    catch(error){
        console.log(error);
    }
}

async function createOrder(req,res){
    console.log(0);
    const quantity=req.body.quantity;
    const id=req.body.id;
    try{    
        console.log(0.5);

        const sqlconnection=await connectionrequest();

        const [products]=await sqlconnection.promise().query(`SELECT * FROM products WHERE id=?`,[id]);
        const product=products[0];
        if(product.quantity<quantity){
            return res.render("placeOrder",{
                user:req.user,
                product:product,
                error:"Not enough stock",
            });
        }
    
        // const product=await Product.findOne({_id:id});
        const totalPrice=quantity*product.price;
        console.log(2);
        await sqlconnection.promise().query(`INSERT INTO orders(user_id,product_id,quantity,totalPrice) VALUES (?,?,?,?)`,[req.user.id,id,quantity,totalPrice]);
        console.log(3);
        // await Order.create({
        //     user:req.user.id,
        //     products:[
        //         {
        //             product:id,
        //             quantity:quantity,
        //             price:product.price,
        //         }
        //     ],
        //     totalPrice:quantity*product.price,
        //     status:"Pending",
        // });

        await sqlconnection.promise().query(`UPDATE products SET quantity=? WHERE id=?`,[product.quantity-quantity,id]);
        console.log(4);
        // product.quantity=product.quantity-quantity;
        // await product.save();

        await sqlconnection.promise().query(`DELETE FROM carts WHERE product_id=?`,[id]);
        console.log(5);
        // await Cart.deleteMany({productId:id});
        return res.redirect("/");
    }catch(error){
        console.log(error);
        return res.redirect("/cart");
    }
}

//to show user's orders
async function myOrders(req,res){

    const sqlconnection=await connectionrequest();

    const [orders]=await sqlconnection.promise().query(`SELECT orders.*,products.*,orders.quantity as quantity,products.quantity as pquantity FROM orders INNER JOIN products ON orders.product_id=products.id WHERE orders.user_id=?`,[req.user.id]);
    
    // const orders=await Order.find({user:req.user.id}).populate("products.product").sort({date:-1});
    
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