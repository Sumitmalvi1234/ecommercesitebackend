const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword
        } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create access token
        const accessToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // Create refresh token
        const refreshToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Store refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Send refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send access token in response
        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET CURRENT USER
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// REFRESH ACCESS TOKEN
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required"
            });
        }

        // Find user with this refresh token
        const user = await User.findOne({
            refreshToken: token
        });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Make sure token belongs to same user
        if (decoded.userId.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        // Create new access token
        const accessToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        );

        res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
};
// LOGOUT
const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (token) {
            await User.findOneAndUpdate(
                { refreshToken: token },
                { refreshToken: null }
            );
        }

        res.clearCookie("refreshToken");

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    refreshToken,
    logout
};