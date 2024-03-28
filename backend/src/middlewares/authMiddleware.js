const jwt = require("jsonwebtoken");
require('dotenv').config();

function verifyToken(req, res, next) {
    const token = req.headers.token;

    console.log('hi from middleware! there is the token: ', token)
    if (token) {
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
                if (err) {
                    return res.sendStatus(403); // token is not valid
                }
                next();
            });
        } catch (err) {
            console.log('ERROR! cant verify jwt: ', err)
        }
    } else {
        res.sendStatus(401); // there is no token
    }
};

module.exports = { verifyToken };