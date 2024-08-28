const mysql=require("mysql2");


module.exports=async function(){
    const sqlconnection= await mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'7984',
        database:'ecommerce'
    });
    
    // console.log(sqlconnection);
    
    const promise = await new Promise( (resolve,reject)=>(sqlconnection.connect(async(err)=>{
        if(err){
            console.log(err);
        };
        console.log("Connected to MySQL");
        await sqlconnection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone varchar(10) UNIQUE,
                address TEXT,
                role ENUM('user','transporter', 'admin') DEFAULT 'user',
                isVerified boolean default false
            )
        `);
        
        await sqlconnection.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                imageURL VARCHAR(255),
                name VARCHAR(255) NOT NULL,
                quantity INT NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                seller_id INT,
                available boolean default true,
                FOREIGN KEY (seller_id) REFERENCES users(id)
            );
        `);
        
        await sqlconnection.execute(`
            CREATE TABLE IF NOT EXISTS carts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                product_id INT,
                quantity int default 1,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `)
        
        await sqlconnection.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                product_id INT,
                quantity INT NOT NULL,
                totalPrice DECIMAL(10,2) NOT NULL,
                status ENUM('pending','shipped','delivered') DEFAULT 'pending',
                deliveredAt DATETIME,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                cancelledAt DATETIME,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            );
        `);

        await sqlconnection.execute(`
                CREATE TABLE IF NOT EXISTS resetPassword (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    userId INT,
                    token VARCHAR(255),
                    expiresAt varchar(15),
                    FOREIGN KEY (userId) REFERENCES users(id)
                );
        `)

        await sqlconnection.execute(`
            CREATE TABLE IF NOT EXISTS verifyUsers(
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT,
                token VARCHAR(255),
                FOREIGN KEY (userId) REFERENCES users(id)
            );
        `)

        console.log("tables created Successfully");    
        resolve("done");
    })));
    return sqlconnection;
};
