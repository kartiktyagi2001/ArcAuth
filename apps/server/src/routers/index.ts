import type { Request, Response } from "express";
import { Router } from "express";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'querystring';
import { access } from "fs";
import { de } from "zod/locales";

const googleRouter = Router();
const githubRouter = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET!;

const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI!;
const FRONTEND_URI = process.env.FRONTEND_URI!;

//Routers
googleRouter.get("/", Google)
googleRouter.get('/callback', GoogleCallback)
githubRouter.get('/', Github)
githubRouter.get('/callback', GithubCallback)


//Functions

// Google router
function Google(req: Request, res: Response){
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
}

// Google callback route
async function GoogleCallback (req: Request, res: Response){
    const code = req.query.code as string; //app will send a code after consent of user

    if(!code)
        return res.status(400).send('Consent Denied! Please Allow Access to Continue');

    try{

        const params = qs.stringify({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        })

        //exchange code for access token
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', params, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
        
        const {id_token} = tokenRes.data;  //token from google in exchange of code

        const user =  jwt.decode(id_token) as any; //decode the token to get user info
        
        // generating my own jwt token for clients 
        const finalToken = jwt.sign({sub: user.sub, email: user.email, name: user.name}, JWT_SECRET);

        res.redirect(`${FRONTEND_URI}?token=${finalToken}`)


    } catch{
        res.status(500).send("Google Authentication Failed! Please Try Again!")
    }
}

//Github Router
function Github(req: Request, res: Response){
    const params = qs.stringify({
        client_id: GITHUB_CLIENT_ID,
        redirect_uri: GITHUB_REDIRECT_URI,
        scope:'read:user user:email',
        state: 'github'
    })

    res.redirect(`https://github.com/login/oauth/authorize?${params}`); //consent screen
}

// github callback
async function GithubCallback(req: Request, res: Response){
    const code = req.query.code as string;

    if(!code)
        res.status(400).send('Access Denied!')

    const params = {
        code,
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        redirect_uri: GITHUB_REDIRECT_URI   //increases security by matching exactly what was sent in the original authorization request :)
    }

    try{
        const tokenRes = await axios.post('https://github.com/login/oauth/access_token', params, {headers:{Accept:'application/json'}});    //asking for access token in exchange of code

        const accessToken = tokenRes.data.access_token;

        const userRes = await axios.get('https://api.github.com/user', {headers: {Authorization: `token ${accessToken}`}});

        const user = userRes.data;

        const token = jwt.sign({sub:user.id, login: user.login, avatar: user.avatar_url}, JWT_SECRET)   //final token for client websites

        return res.redirect(`${FRONTEND_URI}?token=${token}`);
    } catch(err){
        console.error(err)
        return res.status(500).send('Github Authentication Failed!');
    }
}

export {googleRouter, githubRouter};