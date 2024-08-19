const jwt = require("jsonwebtoken");
require('dotenv').config();

function verifyToken(req, res, next) {
    const token = req.headers.token;

    console.log('hi from middleware! there is the token: ', token)
    if (token) {
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.log('token err.name: ', err.name)
                    if (err.name == 'TokenExpiredError') {
                        console.log("Error! Token is expired.");
                        return res.status(403).send('Token is expired, Please log in again.');
                    } else {
                        console.log("Error! Token is invalid.");
                        return res.status(403).send('Token is not valid, Please log in again.');
                    }
                }
                req.user = decoded;
                next();
            });
        } catch (err) {
            console.log('ERROR! cant verify jwt: ', err)
        }
    } else {
        res.status(401); // there is no token
    }
};

module.exports = { verifyToken };