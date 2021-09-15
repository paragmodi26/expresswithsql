const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
const mysql = require('mysql')
// var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({extended: true}));
const session = require('express-session');
app.use(session({secret: "Shh, its a secret!"}));
// app.use(bodyParser.urlencoded({extended:true}))
// app.use(bodyParser.json())

//now create Root path

app.get('/', function (req, res) {
    res.send("This Is Home Page")
})
app.listen(port, function () {
    console.log("app listen to the port http://127.0.0.1:" + port)
})
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mysql@123",
    database: "expresstest"
})
connection.connect(function (err) {
    if (err) throw err
    console.log("data Base Connected")
})
app.get('/alluser', function (req, res) {
    connection.query('select * from user', function (err, rows, fields) {
        if (!err) {

            res.send(rows)
        } else {
            res.send(err)
        }
    })
})
app.post('/useradd', function (req, res) {
    console.log(req.body.userid);
    var userid = req.body.userid
    var username = req.body.username
    var email = req.body.email
    var mobile = req.body.mobile

    connection.query(`insert into user(userid,username,email,mobile) values(?,?,?,?)`, [userid, username, email, mobile], function (err, rows, fields) {
        if (!err) {
            app.use(session({
                secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
                saveUninitialized:true,
                cookie: { userid:userid },
                resave: false
            }));
            res.redirect("/alluser")
        } else {
            res.send(err)
        }
    })
})

app.get('/userbyid/:userid', function (req, res) {
    var userid = req.params.userid
    console.log(userid)
    connection.query('select * from user where userid=' + userid, function (err, rows, fields) {
        if (!err) {
            if (rows.length === 0) {
                res.send("no data found").status(404)
            } else {
                res.send(rows).status(200)
            }
        } else {
            res.send("error").status(404)
        }
    })
})

app.delete('/deleteuser/:userid', function (req, res) {
    connection.query('select * from user where userid=' + req.params.userid, function (err, rows, fields) {
        if (!err) {
            if (rows.length === 0) {
                res.send("no data found").status(404)
            } else {
                connection.query(`delete from user where userid=?`, [req.params.userid], function (err, rows, fields) {
                    if (!err) {
                        if (rows.length === 0) {
                            res.send("no data available at " + req.params.userid + " userid")
                        } else {
                            res.send('data delete succesfully')
                        }
                    } else {
                        res.send(err)
                    }
                })

            }
        } else {
            res.send("error").status(404)
        }
    })
})


app.post('/login',function(req,res){
    let email=req.body.email
    let mobile=req.body.mobile
    console.log(email,mobile)
    connection.query(`select * from user where email=? and mobile=?`,[email,mobile],function(err,rows,fields){
        if(!err){
            if(rows.length===0){
                res.send('no user Found or invalid details')
            }
            else{
                res.send('login success '+rows[0].email)
            }
        }
        else{
            res.send(err)
        }
    })
})


app.put('/update/:userid',function(req,res){
    connection.query(`update user set email=?,mobile=?,username=? where userid=?`,[req.body.email,req.body.mobile,req.body.username,req.params.userid],function(err,rows,fields){
        res.send(rows)
    })
})

