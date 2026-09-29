const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check Authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token required"
            });
        }

        // Get token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // Attach user information
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
};

module.exports = authenticate;