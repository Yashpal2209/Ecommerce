const bcrypt=require("bcrypt");
async function hash(){
    const hashedPassword = await bcrypt.hash("123456", 10);
    const hashedPassword1 = await bcrypt.hash("12345", 10);
    console.log(hashedPassword);
    console.log(hashedPassword1);
}

hash();
