const connectionrequest=require("../mysqlconnect");

async function showProducts(req,res){
    const sqlconnection=await connectionrequest();
    const [products] = await sqlconnection.promise().query("SELECT * FROM products where seller_id=?",[req.user.id]);
    res.render("myProducts",{
        user:req.user,
        products:products
    });
}

async function updateForm(req,res){
    const id=req.query.id;

    const sqlconnection=await connectionrequest();

    const [product] = await sqlconnection.promise().query(`SELECT * FROM products WHERE id=?`,[id]);

    res.render("updateProduct",{
        user:req.user,
        product:product[0],
    });
}

async function updateDetails(req,res){
    console.log(req.body);
    const id=req.body.id;
    const name=req.body.name;
    const price=req.body.price;
    const quantity=req.body.quantity;
    const description=req.body.description;

    const sqlconnection=await connectionrequest();

    const [result]=await sqlconnection.promise().query("UPDATE products SET name=?,quantity=?,price=?,description=? WHERE id=?",[name,quantity,price,description,id]);

    res.end();
}

async function deleteProduct(req,res){
    const id=parseInt(req.body.id);
    const avail=req.body.avail;
    const sqlconnection=await connectionrequest();
    if(!avail){
        const [result1]= await sqlconnection.promise().query(`DELETE FROM carts WHERE product_id=?`,[id]);
        const [result]=await sqlconnection.promise().query(`UPDATE products SET available=false WHERE id=?`,[id]);
    }else{
        const [result]=await sqlconnection.promise().query(`UPDATE products SET available=true WHERE id=?`,[id]);
    }
    res.end();
}

async function showAllOrders(req,res){
    const sqlconnection=await connectionrequest();

    const [orders]=await sqlconnection.promise().query(`SELECT orders.*,products.*,users.*,orders.id as order_id ,users.name as buyyer,orders.quantity as quantity,products.quantity as pquantity,products.name as product_name FROM orders INNER JOIN products ON orders.product_id=products.id INNER JOIN users on orders.user_id=users.id`);
   
    res.render("allOrders",{
        user:req.user,
        orders:orders
    });
}

async function updateStatus(req,res){
    const id=parseInt(req.body.id);
    const status=req.body.status;
    const sqlconnection=await connectionrequest();
    const [result]=await sqlconnection.promise().query("UPDATE orders SET status=? WHERE id=?",[status,id]);
    console.log("updated");
    return res.end();
}

module.exports={
    showProducts,
    updateForm,
    updateDetails,
    deleteProduct,
    showAllOrders,
    updateStatus
};