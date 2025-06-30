import cloudinary from "../lib/cloudinary.js"
import User from "../models/user.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Signup a new User

export const signup = async (req, res) => {

    const { fullName, email, password, bio } = req.body

    try {

        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ success: false, message: "Missing Details" })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: "Account Already exist" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        })

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET,)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({ success: true, message: "Account  Created Successfully", userData: newUser })


    } catch (error) {
        console.log("Error in Signup -> " + error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", })

    }
}

// Login User

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not Found" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid Password" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({ success: true, message: "Login Successfully", userData: user, token })

    } catch (error) {
        console.log("Error in Login -> " + error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", })
    }
}


//controller to check if user is authenticated

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json({ success: true, user: req.user })

    } catch (error) {
        console.log("Error in checkAuth -> " + error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", })
    }
}

//controller to update user profile details
export const updateProfile = async (req, res) => {

    try {
        const { fullName, bio } = req.body
        const image = req.file

        const userId = req.user._id

        let updateUser;

        if (fullName) {
            updateUser = await User.findByIdAndUpdate(userId, { fullName }, { new: true })
        }

        if (bio) {
            updateUser = await User.findByIdAndUpdate(userId, { bio }, { new: true })
        }

        if (req.file) {
            const upload = await cloudinary.uploader.upload(image.path , { resource_type: "image" })
            updateUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url }, { new: true })
        }

        return res.status(200).json({ success: true, user: updateUser , message:"profile update successfully"})

    } catch (error) {
        console.log("Error in updateUser -> " + error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error", })
    }
}

//logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',

        })
        return res.status(200).json({ success: true, message: " User Logout Successfully" })

    } catch (error) {
        console.log("Error in Logout User  -> ", error.message)
        return res.status(500).json({ success: false, message: " Internal Server Error " })
    }
}



