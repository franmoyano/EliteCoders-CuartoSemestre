import jwt from "jsonwebtoken";

export const createAccessToken = (paylod) => {
    return new Promise((resolve, reject) => {
        jwt.sign(paylod, "xyz123", { expiresIn: "id" }, (err, token) => {
        if (err) reject(err);
        resolve(token);
        });
    });
    };
