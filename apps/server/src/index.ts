import "dotenv/config";
import cors from "cors";
import express from "express";

import { googleRouter } from "./routers/index";
import { githubRouter } from "./routers/index";


const app = express();


app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "",
		methods: ["GET", "POST", "OPTIONS"],
	}),
);

app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

app.use('/auth/google', googleRouter);
app.use('/auth/github', githubRouter);

app.listen("0.0.0.0", () => {
	console.log(`Server is running on Railway`);
});
