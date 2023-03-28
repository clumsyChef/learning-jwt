import dotenv from "dotenv";
import jwt from "jsonwebtoken";

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
            //
        }
    } else {
        req.user = decodedAccess;
        return next();
    }

    return next();
};

export default tokenChecking;
