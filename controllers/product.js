const connectionrequest=require("../mysqlconnect");

//to send all products to home page according to pagination
async function showAllProducts(limit,offset,seller_id=null){
    const sqlconnection=await connectionrequest();
    if(seller_id!=null){//for verified user
        const [totalItems]=await sqlconnection.promise().query('SELECT COUNT(*) as count FROM products where available=true and seller_id!=?',[seller_id]);
        const [products]=await sqlconnection.promise().query(`SELECT * FROM products where available=true and seller_id!=? LIMIT ? OFFSET ? `, [seller_id,limit, offset]);
        return {
            totalItems:totalItems,
            products:products
        };
    }
    //for user who is not verified
    const [totalItems]=await sqlconnection.promise().query('SELECT COUNT(*) as count FROM products where available=true ');
    const [products]=await sqlconnection.promise().query(`SELECT * FROM products where available=true LIMIT ? OFFSET ? `, [limit, offset]);
    return {
        totalItems:totalItems,
        products:products
    };
}

module.exports={
    showAllProducts,
};