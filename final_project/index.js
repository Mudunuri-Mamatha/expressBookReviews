const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

//app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
//});

app.use("/customer/auth/*", (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], "secretKey");
        req.user = decoded; // Attach decoded user info to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT =5000;

app.listen(PORT,()=>console.log("Server is running"));
