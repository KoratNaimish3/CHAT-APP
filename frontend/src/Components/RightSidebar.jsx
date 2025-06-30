import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { useAppContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { ChatContext } from '../../context/ChatContext'



function RightSidebar() {

  const { axios, setAuthUser, setOnlineUser, socket, onlineUser } = useAppContext()
  const { selectedUser, messages } = useContext(ChatContext)
  const [messageImages, setMessageImages] = useState([])

  //get all the images from tje message and set them to state
  useEffect(() => {
    if (messages) {
      setMessageImages(
        messages.filter((msg) => msg.image).map((msg) => msg.image)
      )
    }

  }, [messages])

  const logout = async () => {
    try {

      const { data } = await axios.post('/api/auth/logout')
      if (data.success) {

        toast.success(data.message)
        setAuthUser(null)
        setOnlineUser([])
        socket.disconnect()

      }

    } catch (error) {
      console.error(` error in logout user (axios)`, error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)

      }
      else {
        toast.error("An unexpected error occurred. Please try again.");

      }
    }
  }

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>
      {/* Profile */}
      <div className='pt-12 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />

        <h1 className='px text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUser.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
        </h1>

        <p className=' mx-auto'>
          {selectedUser.bio}
        </p>
      </div>

      <hr className='border-[#ffffff50] my-4' />

      {/* media */}

      <div className='px-5 text-xs'>
        <p>media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {messageImages?.map((image, index) => (
            <div key={index} onClick={() => window.open(image)} className='cursor-pointer rounded'>
              <img src={image} alt="" className='h-full rounded-md' />
            </div>
          ))}


        </div>
      </div>

      <button onClick={logout} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
        Logout
      </button>
    </div>
  )
}

export default RightSidebar