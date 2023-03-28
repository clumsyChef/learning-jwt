import express from "express";
import { logger } from "./logger.js";
import SessionController from "./controller.js";
import tokenChecking from "./tokenChecking.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(tokenChecking);

app.use(cors());

app.get("/", SessionController.getSession);
app.post("/login", SessionController.createSession);
app.delete("/logout", SessionController.deleteSession);

app.listen(3500, () => {
    console.log("Server is running on port 3500.");
});
