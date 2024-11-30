const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports.isLoggedIn = (req,res,next) =>{
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);  
        req.user = decoded;  
        next();  
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
    next();
};



module.exports.jwtMiddleware =  (req, res, next) => {
    const token = req.cookies.token;  
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded;  
        next();
    } catch (err) {
        console.error("Error verifying token:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};