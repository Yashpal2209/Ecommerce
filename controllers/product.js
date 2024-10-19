const connectionrequest=require("../mysqlconnect");

//to send all products to home page according to pagination
async function showAllProducts(limit,offset,seller_id=null){
    const sqlconnection=await connectionrequest();
    if(seller_id!=null){//for verified user
        const [totalItems]=await sqlconnection.promise().query('SELECT COUNT(*) as count FROM products where available=true and quantity>0 and seller_id!=?',[seller_id]);
        const [products]=await sqlconnection.promise().query(`SELECT * FROM products where available=true and quantity>0 and seller_id!=? LIMIT ? OFFSET ? `, [seller_id,limit, offset]);
        return {
            totalItems:totalItems,
            products:products
        };
    }
    //for user who is not verified
    const [totalItems]=await sqlconnection.promise().query('SELECT COUNT(*) as count FROM products where available=true and quantity>0 ');
    const [products]=await sqlconnection.promise().query(`SELECT * FROM products where available=true and quantity>0 LIMIT ? OFFSET ? `, [limit, offset]);
    return {
        totalItems:totalItems,
        products:products
    };
}

async function showAllUnAvailProducts(limit,offset,seller_id=null){
    const sqlconnection=await connectionrequest();
    if(seller_id!=null){//for verified user
        const [totalItems]=await sqlconnection.promise().query('SELECT COUNT(*) as count FROM products where available=false or quantity=0 and seller_id!=?',[seller_id]);
        const [products]=await sqlconnection.promise().query(`SELECT * FROM products where available=false or quantity=0 and seller_id!=? LIMIT ? OFFSET ? `, [seller_id,limit, offset]);
        return {
            totalItems:totalItems,
            products:products
        };
    }
    //for user who is not verified
    const [totalItems]=await sqlconnection.promise().query('SELECT COUNT(*) as count FROM products where available=false or quantity=0');
    const [products]=await sqlconnection.promise().query(`SELECT * FROM products where available=false or quantity=0 LIMIT ? OFFSET ? `, [limit, offset]);
    return {
        totalItems:totalItems,
        products:products
    };
}

async function showSearchedProducts(text,limit,offset,seller_id=null){
    const sqlconnection=await connectionrequest();
    if(seller_id!=null){//for verified user
        const [totalItems]=await sqlconnection.promise().query('SELECT COUNT(*) as count FROM products where available=1 and quantity>0 and seller_id!=? and (name like ? or description like ? or price like ?) ',[seller_id,`%${text}%`,`%${text}%`,`%${text}%`]);
        const [products]=await sqlconnection.promise().query(`SELECT * FROM products where available=1 and quantity>0 and seller_id!=? and (name like ? or description like ? or price like ?) LIMIT ? OFFSET ? `,[seller_id,`%${text}%`,`%${text}%`,`%${text}%`,limit, offset]);
        return {
            totalItems:totalItems,
            products:products
        };
    }
    //for user who is not verified
    const [totalItems]=await sqlconnection.promise().query('SELECT COUNT(*) as count FROM products where available=true and quantity>0 and (name like ? or description like ? or price like ?)',[`%${text}%`,`%${text}%`,`%${text}%`]);
    const [products]=await sqlconnection.promise().query(`SELECT * FROM products where available=true and quantity>0 and (name like ? or description like ? or price like ?) LIMIT ? OFFSET ? `, [`%${text}%`,`%${text}%`,`%${text}%`,limit, offset]);
    return {
        totalItems:totalItems,
        products:products
    };
}

module.exports={
    showAllProducts,
    showAllUnAvailProducts,
    showSearchedProducts
};