// importing require modules

const express=require("express");
require("dotenv").config();
const cors=require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {connection}=require("./db");
const {UserModel}=require("./models/userModel");
const {employeeRouter}=require("./routes/Employees.routes");
const {auth}=require("./middelware/auth")



const app=express();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.json({message:"Employee Management Api is Working!"});
})

// For signup
app.post("/signup",async (req,res)=>{
    const{email,password,confirm_password}=req.body;
    const user_exist=await UserModel.findOne({email});
    if(user_exist)
    {
        return res.json({message:"User already exist please go to login page"});
    }
    else{ 
        if(password===confirm_password)  // verifying password matching or not
    {
        bcrypt.hash(password, 8, async function(err, hash) {
            await UserModel.create({email,password:hash});
            return res.json({message:"Signup Successfull"});

    })
    }
    else{
        return res.json({message:"Password does not Match, please try again"})
    }
}
})

// for login
app.post("/login",async (req,res)=>{
    const{email,password}=req.body;
    const user=await UserModel.findOne({email});

    const hashed_password=user.password;
    try {
        bcrypt.compare(password,hashed_password, function (err,result){
            if(!result)
            {
                return res.json({message:"Invalid credentials"});
            }
            const token=jwt.sign({userId:user._id},process.env.key);
            res.json({message:"login successfull", token:token});
        })
    } catch (error) {
        console.log(error);
    }
})


app.use(auth);
app.use("/employees",employeeRouter);
var port=process.env.port;
app.listen(port, async()=>{
    try {
        await connection;
        console.log("Connected to the MongoDB");
    } catch (error) {
        console.log("Error while connecting to DB");
        console.log(error);
    }
    console.log(`Listening on port ${port}..`)
})