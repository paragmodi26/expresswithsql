const express=require('express')
const bodyParser=require('body-parser')
const app=express()
const port=process.env.PORT || 8080
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//now create Root path

app.get('/',function (req,res){
    res.send("This Is Home Page")
})
app.listen(port,function (){
    console.log("app listen to the port http://127.0.0.1:" +port)
})