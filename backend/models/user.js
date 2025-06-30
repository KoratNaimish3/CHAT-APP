import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        require: true,
    },

    email: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String,
        require: true,
        minlength: 6
    },

    profilePic: {
        type: String,
        default: "",
    },

    bio: {
        type: String
    }

},{timestamps:true})

const User = mongoose.model("user",userSchema)

export default User

