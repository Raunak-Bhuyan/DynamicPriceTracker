const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/generateToken");

router.post("/register",async (req,res)=>{
    try {
        let {fullname, username, email, password} = req.body;

        let user = await userModel.findOne({email: email});
        if(user) 
        {
                return res.status(200).json({
                success: false,
                message: `User Account already Exists with username: ${user.username}`,
            });
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function(err, hash){
                if(err) return res.send(err.message);
                else{
                    let user = await userModel.create({
                        fullname,
                        username,
                        email,
                        password: hash,
                    });
                    let token = generateToken(user);
                    res.cookie("token", token);
                    res.status(200).json({
                        success: true,
                        message: `User Account created successfully.`,
                    });
                }
            });
        });
    } catch (error) {
        console.log(error.message);
    }
});

router.post("/login",async (req,res)=>{
    let {email, password} = req.body;

    let user = await userModel.findOne({email:email});
    if(!user)
    {
        return res.status(200).json({
            registered: false,
            authorized: false,
            message: `User is not registered !!!`,
        });
    }

    bcrypt.compare(password, user.password, function(err,result){
        if(result){
            let token = generateToken(user);
            res.cookie("token", token);
            res.status(200).json({
                registered: true,
                authorized: true,
                message: `Authorized !!!`,
            });
        }
        else{
            res.status(200).json({
                registered: true,
                authorized: false,
                message: `Not Authorized !!!`,
            });
        }
    })
});

router.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.end();
});

module.exports = router