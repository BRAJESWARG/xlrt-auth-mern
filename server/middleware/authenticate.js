const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async (req, res, next) => {


    // const authHeader = req.headers.token;
    // if (authHeader) {
    //     const token = authHeader.split(" ")[1];
    //     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //         if (err) res.status(403).json("Token is not valid");
    //         req.user = user;
    //         next();
    //     });
    // } else {
    //     return res.status(402).json("You are not authorized");
    // }


    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        // if (rootUser) {
        //     req.rootUser = rootUser;
        //     req.token = token;
        //     req.userID = rootUser._id;

        //     next();
        // }


        if (!rootUser) { throw new Error('User not Found') }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    } catch (err) {
        res.status(401).send('Unauthorized: No token provided');
        console.log(err);
    }
}

module.exports = Authenticate;