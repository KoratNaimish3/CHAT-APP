import { createContext, useEffect, useState } from "react";
import { useAppContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([])  //selected user na
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null) //store user id
    const [unseenMessages, setUnseenMessages] = useState({})

    const { axios, socket } = useAppContext()

    //function to get all users for sidebar

    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users')

            if (data.success) {

                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            console.error(" error in  checkAuth (axios)", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            }
            else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    }

    //function to get messages for selected user

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.error(" error in  checkAuth (axios)", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            }
            else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    }

    //function to send message to selected user

    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if (data.success) {
                setMessages((prevMessages) => [

                    ...prevMessages, data.newMessage
                ]
                )
            }
        } catch (error) {
            console.error(" error in  checkAuth (axios)", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            }
            else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    }

    //function to subscribe to messages for selected user

    const subscribeToMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true
                setMessages((prevMessages) => [
                    ...prevMessages, newMessage
                ])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    //function to unsubscribe to messages
    const unsubscribeToMessages = () => {
        if(socket) socket.off("newMessage")
    }   

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeToMessages()
    }, [socket, selectedUser])


    const value = {
        messages, setMessages, users, setUsers, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages, getUsers, unsubscribeToMessages, subscribeToMessages, sendMessage, getMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
