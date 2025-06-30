import {  createContext, useContext, useEffect, useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";
import { io } from 'socket.io-client'


const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl
axios.defaults.withCredentials = true //send cookie to api request


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [authUser, setAuthUser] = useState(null)
    const [onlineUser, setOnlineUser] = useState([])
    const [socket, setSocket] = useState(null)
    console.log(socket)

    //check if user is authenticated and if so , set the user data and connect the socket

    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/api/auth/check')

            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }

        } catch (error) {
         console.log(error)
        }
    }

    //connect socket function to andle socket connection and online user update
    const connectSocket = (userData) => {

        if (!userData || socket?.connected) return

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        })

        newSocket.connect()
        setSocket(newSocket)

        newSocket.on("getOnlineUsers", (userId) => {
            setOnlineUser(userId)
        })
    }

    useEffect(() => {
        checkAuth()
    }, [])


    const value = {
        axios, authUser, onlineUser, socket, setAuthUser, setOnlineUser, setSocket, connectSocket , checkAuth
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AuthContext)
}