import User from "../models/user.js"
import jwt from 'jsonwebtoken'


export const protectRoute = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if (!token) {
            return res.status(400).json({ success: false, message: "Not Authorized" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" })
        }

        req.user = user
        next()


    } catch (error) {
        console.log("Error in isauth -> " + error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", })
    }
}