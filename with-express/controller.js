import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const db = [
    {
        username: "sarthak",
        email: "sarthak@something.com",
        password: "sarthak123",
    },
];

export const mainSession = {};

const createSession = (req, res, next) => {
    const { email, password } = req.body;

    const user = db.find(
        (item) => item.email === email && item.password === password
    );

    if (!email || !password || !user) {
        return res
            .status(403)
            .json({ message: `Email or Password are not correct.` });
    }

    const sessionId = Object.keys(mainSession).length + 1;

    const sessionData = { sessionId, email, valid: true };

    mainSession[sessionId] = sessionData;

    const accessToken = jwt.sign(
        { email, sessionId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign(
        { sessionId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1y" }
    );

    res.cookie("accessToken", accessToken, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
        maxAge: 3.154e10,
        httpOnly: true,
    });

    return res.send(sessionData);
};

const deleteSession = (req, res, next) => {
    console.log("delete", req.user);
    if (!req?.user) {
        return res.send("Nothing to logout");
    }
    res.cookie("accessToken", "", {
        maxAge: 0,
        httpOnly: true,
    });

    res.cookie("refreshToken", "", {
        maxAge: 0,
        httpOnly: true,
    });

    mainSession[req.user.sessionId].valid = false;

    return res.send(mainSession[req.user.sessionId]);
};

const getSession = (req, res, next) => {
    if (!req?.user) {
        return res.send("Not Logged In");
    }
    return res.send(req.user);
};

export default { createSession, deleteSession, getSession };
