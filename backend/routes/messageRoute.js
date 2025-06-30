import express from 'express'
import { protectRoute } from '../middleware/auth.js'
import { getMessages, getUsersForSidebar, markMessageAsseen, sendMessage } from '../controllers/messageController.js'
import { upload } from '../middleware/multer.js'

const messageRouter = express.Router()

messageRouter.get('/users',protectRoute , getUsersForSidebar)
messageRouter.get('/:id',protectRoute , getMessages)
messageRouter.put('/mark/:id',protectRoute , markMessageAsseen)
messageRouter.post('/send/:id',protectRoute ,upload.single('image'), sendMessage)


export default messageRouter
