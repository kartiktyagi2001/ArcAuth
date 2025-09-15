import type { Request, Response } from "express";
import { Router } from "express";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'querystring';
import { access } from "fs";

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET!;

const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI!;
const FRONTEND_URI = process.env.FRONTEND_URI!;


// Google route
router.get("/auth/google", (req: Request, res: Response)=>{
    const params = qs.stringify({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
        state: "google"
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
})

// Google callback route
router.get('/auth/google/callback', async (req: Request, res: Response)=>{
    const code = req.query.code as string; //app will send a code after consent of user

    if(!code)
        return res.status(400).send('Consent Denied! Please Allow Access to Continue');

    try{

        const cbParams = qs.stringify({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        })

        //exchange code for access token
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', cbParams, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        
        const {token} = tokenRes.data;  //token from google in exchange of code

        const user =  jwt.decode(token) as any; //decode the token to get user info
        
        // generating my own jwt token for clients 
        const finalToken = jwt.sign({sub: user.sub, email: user.email, name: user.name}, JWT_SECRET);

        res.redirect(`${FRONTEND_URI}?token=${finalToken}`)


    } catch{
        res.status(500).send("Google Authentication Failed! Please Try Again!")
    }
})