import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { mainSession } from "./controller.js";

dotenv.config();

const tokenChecking = (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken) {
        return next();
    }

    let decodedAccess;
    try {
        decodedAccess = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
    } catch (error) {
        decodedAccess = error.message;
    }

    console.log("DECODED", decodedAccess);

    if (
        typeof decodedAccess === "string" &&
        decodedAccess.includes("jwt expired")
    ) {
        let decodedRefresh;
        try {
            decodedRefresh = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
        } catch (error) {
            decodedRefresh = error.message;
        }
        if (
            typeof decodedRefresh === "string" &&
            decodedRefresh.includes("jwt expired")
        ) {
            return next();
        } else {
            if (!decodedRefresh || !decodedRefresh?.sessionId) {
                return next();
            }
            const { sessionId } = decodedRefresh;
            const { email } = mainSession[sessionId];
            const newAccessToken = jwt.sign(
                { email, sessionId },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10s" }
            );

            res.cookie("accessToken", newAccessToken, {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
            });

            let againAccess = jwt.verify(
                newAccessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            req.use = againAccess;

            console.log("NEW ACCESS TOKEN GENERATED");
            return next();
        }
    } else {
        req.user = decodedAccess;
        return next();
    }

    return next();
};

export default tokenChecking;
