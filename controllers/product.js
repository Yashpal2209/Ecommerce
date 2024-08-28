const connectionrequest=require("../mysqlconnect");

async function showAllProducts(limit,offset,seller_id=null){
    const sqlconnection=await connectionrequest();
    if(seller_id!=null){
        const [totalItems]=await sqlconnection.promise().query('SELECT COUNT(*) as count FROM products where available=true and seller_id!=?',[seller_id]);
        const [products]=await sqlconnection.promise().query(`SELECT * FROM products where available=true and seller_id!=? LIMIT ? OFFSET ? `, [seller_id,limit, offset]);
        return {
            totalItems:totalItems,
            products:products
        };
    }
    
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