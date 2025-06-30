import React, { use, useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ChatContext } from '../../context/ChatContext';

function Sidebar() {

  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext)
  const navigate = useNavigate();

  const { axios, setAuthUser, setOnlineUser, socket, onlineUser } = useAppContext()

  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false);

  const filterUsers = input
    ? users.filter((user) =>
      user?.fullName?.toLowerCase().includes(input.toLowerCase())
    )
    : users

  useEffect(() => {
    if (onlineUser) {
      getUsers()
    }
  }, [onlineUser]) //when new user register , login(status change (active)) so server send emit and setnlineuser updated


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
  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      <div className='pb-5 '>

        {/* logo and menu */}

        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-40' />

          <div className="relative py-2">
            <img
              src={assets.menu_icon}
              alt="menu_icon"
              className="max-h-5 cursor-pointer"
              onClick={() => setOpen(!open)}
            />

            {open && (
              <div className="absolute top-full right-0 z-20 w-28 border border-gray-600 text-gray-100 bg-[#282142] p-4 rounded-md">
                <p className="cursor-pointer text-sm" onClick={() => { setOpen(false); navigate('/profile'); }}>Edit Profile</p>
                <hr className="my-2 border-t border-gray-500" />
                <p className="cursor-pointer text-sm" onClick={() => { setOpen(false); logout(); }}>Logout</p>
              </div>
            )}
          </div>
        </div>

        {/* serach-Bar */}

        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="search" className='w-3' />
          <input type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User...' onChange={(e) => setInput(e.target.value)} value={input} />
        </div>

      </div>

      {/* User Details */}

      <div className='flex flex-col'>
        {filterUsers?.map((user, index) => (

          <div key={index} onClick={() => {
            setSelectedUser(user); setUnseenMessages((prev => ({
              ...prev, [user._id]: 0
            })))
          }} className={`flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm relative ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>


            <img src={user?.profilePic || assets.avatar_icon} alt="avtar" className='w-[35px] aspect-[1/1] rounded-full' />

            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              {
                onlineUser.includes(user._id)
                  ? <span className='text-green-400 text-xs'>Onine</span>
                  : <span className='text-neutral-400 text-xs'>offline</span>
              }
            </div>

            {unseenMessages[user._id] > 0 && <p className=' absolute top-4 right-4 h-5 w-5 text-sm flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}

          </div>
        ))}

      </div>



    </div>
  )
}

export default Sidebar