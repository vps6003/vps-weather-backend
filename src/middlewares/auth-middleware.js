const express = require('express');
const jwt = require('jsonwebtoken');
const secret_Key = process.env.SECRET_KEY;

const AuthMiddleWare = (req,res,next) =>{
    const authorization = req.headers['Authorization']; // get authorization from headers like token or any key to check

    if(!authorization)  // if no auth present dont pass , block the api call.
    {
        return res.status(401).json({
            message : "No Authorization Header!",
        })
    }
    try{
        const token =  authorization.split("Bearer ")[1];
        if(!token){
            return res.status(401).json({
                message : "Invalid Token Format. Access Denied!",
            })
        }
        const decode = jwt.verify(token,secret_Key);
        req.user = decode;
        next();
    }
  catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Session Expired',
                error: error.message,
            })
        }
        if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
            return res.status(401).json({
                message: 'Invalid Token',
                error: error.message,
            })
        }
        res.status(500).json({
            message: 'Internal server Error',
            error: error.message,
            stack: error.stack
        });
    }
    
}