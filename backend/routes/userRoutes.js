import express from 'express'
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/userController.js'
import { protectRoute } from '../middleware/auth.js'
import { upload } from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.put('/update-profile', protectRoute , upload.single('image') ,updateProfile)
userRouter.get('/check', protectRoute ,checkAuth)
userRouter.post('/logout', protectRoute ,logout)

export default userRouter


