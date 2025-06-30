import express from 'express'
import "dotenv/config"
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoute.js'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT || 5000


//connect to mongodb
connectDB()

//create Express App and HTTP server
const app = express()
const server = http.createServer(app) // because socket.io support this HTTP server

// initialize Socket.io server
export const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
})

//strore online user
export const userSocketMap = {} // {userId : socketID}

//socket io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log("user connected", userId)
    // console.log("socket connected", socket)


    if (userId) {
        userSocketMap[userId] = socket.id
    }

    //Emit online users to all connected Clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("user Disconnected", userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))

    })
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//Middleware setup
app.use(express.json({ limit: "4mb" }))
app.use(cookieParser())
app.use(cors({
    origin: 'https://chat-app-frontend-s7xj.onrender.com',
    credentials: true, // if you're using cookies or HTTP auth
}))


//Router Setup
app.get('/api/status', (req, res) => res.send("server is live"))
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)


server.listen(PORT, () => console.log("Server is running on PORT: " + PORT))



