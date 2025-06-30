import React from 'react'
import Home from './Pages/Home'
import { Route, Routes, Navigate } from 'react-router-dom' // ✅ Import Navigate component
import Login from './Pages/Login'
import { Toaster } from "react-hot-toast"
import { useAppContext } from '../context/AuthContext'
import Profile from './Pages/Profile'

function App() {

  const { authUser } = useAppContext()

  return (
    
    <div className="bg-[url('/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
