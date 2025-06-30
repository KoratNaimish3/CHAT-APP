import mongoose from "mongoose"

//Function To connect to the mongodb Database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/CHAT-APP`)
    } catch (error) {
        console.log("Error in Databse -> " + error.message)

    }
}
