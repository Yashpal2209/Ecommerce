const Cart=require("../model/cart");
const Product=require("../model/product");
const mongoose=require("mongoose");
const connectionrequest=require("../mysqlconnect");


async function addToCart(req,res){
    const id=req.body.id;

    const sqlconnection=await connectionrequest();

    const [cartproduct] = await sqlconnection.promise().query(`SELECT * FROM carts where product_id= ? and user_id=?`,[id,req.user.id]);

    if(cartproduct.length>0){
        return res.send(JSON.stringify({message:"Product already in cart"}));
    }

    await sqlconnection.promise().query('INSERT INTO carts(user_id,product_id) VALUES (?,?)',[req.user.id,id]);

    return res.send(JSON.stringify({message:"addded To cart"}));
}


async function showCart(req,res){

    const sqlconnection=await connectionrequest();
    
    const [result]= await sqlconnection.promise().query(`SELECT * FROM carts WHERE user_id=?`,[req.user.id]);

    const productIds=result.map((item)=>item.product_id);

    if(productIds.length==0){
        return res.render("cart",{
            user:req.user,
            products:[]
        })
    }

    const [products]=await sqlconnection.promise().query(`SELECT * FROM products WHERE id IN (?) `,[productIds]);
    let sum=0;
    for(let i=0;i<products.length;i++){
        products[i].cquantity=result.find((item)=>item.product_id===products[i].id).quantity;
        sum+=products[i].cquantity*products[i].price;
    }
    res.render("cart",{
        user:req.user,
        products:products,
        sum:sum
    });

}

async function removeFromCart(req,res){
    const id=req.body.id;

    const sqlconnection=await connectionrequest();

    const [result]=await sqlconnection.promise().query('DELETE FROM carts WHERE product_id=?',[id]);

    // const result=await Cart.deleteMany({productId:id});
    if(result){
        return res.send(JSON.stringify({message:"Removed from cart"}));
    }
    return res.send(JSON.stringify({message:"Failed to remove from cart"}));
}

async function updateCart(req,res){
    const id=req.body.id;
    const quantity=req.body.quantity;
    const sqlconnection=await connectionrequest();
    await sqlconnection.promise().query('UPDATE carts SET quantity=? WHERE product_id=? AND user_id=?',[quantity,id,req.user.id]);
    res.end();
}

async function removeAll(req,res){
    console.log(4)
    const sqlconnection=await connectionrequest();
    console.log(0)
    const [cartproducts]=await sqlconnection.promise().query(`SELECT carts.*,products.*,carts.quantity as cquantity,products.quantity as quantity  FROM carts INNER JOIN products on carts.product_id=products.id WHERE carts.user_id=?`,[req.user.id]);
    console.log(1)
    for (const product of cartproducts){
        console.log(3)
        const [product1]=await sqlconnection.promise().query(`SELECT * from products where id=? and quantity>=?`,[product.product_id,product.cquantity]);
        console.log(product1);
        if(product1.length>0){
            try {
                // Begin transaction
                await sqlconnection.promise().beginTransaction();
        
                // Update the quantity of the product
                await sqlconnection.promise().query(
                    'UPDATE products SET quantity=quantity-? WHERE id=?',
                    [product.cquantity, product1[0].id]
                );
        
                // Insert into orders table
                await sqlconnection.promise().query(
                    'INSERT INTO orders(user_id, product_id, quantity, totalPrice) VALUES (?,?,?,?)',
                    [req.user.id, product1[0].id, product.cquantity, product.cquantity * product1[0].price]
                );
        
                // Delete from carts table
                await sqlconnection.promise().query(
                    'DELETE FROM carts WHERE product_id=?',
                    [product1[0].id]
                );
        
                // Commit the transaction
                await sqlconnection.promise().commit();
        
                // res.status(200).json({ message: 'Purchased' });
            } catch (error) {
                // Rollback the transaction in case of error
                await sqlconnection.promise().rollback();
                // res.status(500).json({ message: 'Transaction failed', error: error.message });
            }
        }
        // await sqlconnection.promise().query(`INSERT INTO orders(user_id,product_id,quantity,totalPrice) VALUES (?,?,?,?)`,[req.user.id,product.product_id,product.cquantity,product.cquantity*product.price]);
        // await sqlconnection.promise().query('UPDATE products SET quantity=quantity-? WHERE id=?',[product.cquantity,product.product_id]);
        // await sqlconnection.promise().query('DELETE FROM carts WHERE product_id=?',[product.id]);
    };
    // await sqlconnection.promise().query('DELETE FROM carts WHERE user_id=?',[req.user.id]);
    // res.send(JSON.stringify());
    return res.end();
}

async function buyOne(req,res){
    const id=Number(req.body.id);
    const quantity=req.body.quantity;
    const price=req.body.price;
    const sqlconnection=await connectionrequest();
    const [cartproduct]=await sqlconnection.promise().query(`SELECT * FROM carts WHERE product_id=? AND user_id=?`,[id,req.user.id]);
    if(cartproduct.length==0){
        return res.send(JSON.stringify({message:"Product not in cart"}));
    }
    const [product]=await sqlconnection.promise().query(`SELECT * FROM products where id=? and quantity>=?`,[id,quantity]);
    if(product.length>0){
        try {
            // Begin transaction
            await sqlconnection.promise().beginTransaction();
            // Update the quantity of the product
            await sqlconnection.promise().query(
                'UPDATE products SET quantity=quantity-? WHERE id=?',
                [quantity, id]
            );
            // Insert into orders table
            await sqlconnection.promise().query(
                'INSERT INTO orders(user_id, product_id, quantity, totalPrice) VALUES (?,?,?,?)',
                [req.user.id, id, quantity, quantity * price]
            );
            // Delete from carts table
            await sqlconnection.promise().query(
                'DELETE FROM carts WHERE product_id=?',
                [id]
            );
            // Commit the transaction
            await sqlconnection.promise().commit();
    
            res.status(200).json({ message: 'Purchased' });
            return res.end();
        } catch (error) {
            // Rollback the transaction in case of error
            await sqlconnection.promise().rollback();
            res.status(500).json({ message: 'Transaction failed', error: error.message });
            return res.end();
        } finally {
            await sqlconnection.end();
        }
    }
    res.status(500).json({ message: 'Transaction failed', error: error.message });
    return res.end();
}

module.exports={
    addToCart,
    showCart,
    removeFromCart,
    updateCart,
    removeAll,
    buyOne,
}