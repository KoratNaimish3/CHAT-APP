import React, { useContext, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import ChatContainer from '../Components/ChatContainer'
import RightSidebar from '../Components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

function Home() {

  const { selectedUser } = useContext(ChatContext)


  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>

      <div className={`grid grid-cols-1 h-[100%] overflow-hidden border-2 border-gray-600 rounded-2xl backdrop-blur-xl relative text-white ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>

        <Sidebar />
        <ChatContainer />
        <RightSidebar />

      </div>

    </div>
  )
}

export default Home