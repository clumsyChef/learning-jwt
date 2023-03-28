import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const db = [
    {
        username: "sarthak",
        email: "sarthak@something.com",
        password: "sarthak123",
    },
];

const mainSession = {};

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
    //
};

const getSession = (req, res, next) => {
    // return res.send()
};

export default { createSession, deleteSession, getSession };
