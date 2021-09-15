const mysql=require('mysql')
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Mysql@123",
    database:"expresstest"
})
connection.connect(function(err){
    if (err) throw err
    console.log("data Base Connected")
})
module.export=connection