import React, { useState } from 'react'
import assets from '../assets/assets'
import { useAppContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'


function Login() {

  const [currState, setCurrState] = useState('Sign up')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const { axios, setAuthUser, connectSocket } = useAppContext()


  const onSubmitHandler = async (e) => {

    e.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }

    try {
      const { data } = await axios.post(`/api/auth/${currState === "Sign up" ? "signup" : "login"}`, { fullName, email, password, bio })
      if (data.success) {
        setAuthUser(data.userData)
        connectSocket(data.userData)
        toast.success(data.message)

      }
    } catch (error) {
      console.error(" error in  login (axios)", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      }
      else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }


  }


  return (

    <div className='min-h-screen  backdrop-blur-2xl text-white flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col '>

      {/* ---------left----------- */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

      {/* ------------right----------- */}

      <form onSubmit={onSubmitHandler} className='border-2 border-gray-600 bg-white/8 p-6 flex flex-col gap-6 rounded-lg shadow-lg '>

        <h2 className='font-medium text-2xl flex items-center justify-between'>
          {currState}

          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input type="text" className='p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500' placeholder='Full Name' required onChange={(e) => setFullName(e.target.value)} value={fullName} />
        )}

        {!isDataSubmitted && (
          <>
            <input type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' onChange={(e) => setEmail(e.target.value)} value={email} />

            <input type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' onChange={(e) => setPassword(e.target.value)} value={password} />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Provide a short bio' required onChange={(e) => setBio(e.target.value)} value={bio}></textarea>
        )}

        <button className='bg-gradient-to-r from-purple-400 to-violet-600 py-2 text-white rounded-md cursor-pointer' type='submit'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (

            <p className='text-sm text-gray-600'>Already Have an Account? <span className='font-medium text-violet-500 cursor-pointer' onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }}>Login here</span></p>

          ) : (

            <p className='text-sm text-gray-600'>Create an account <span className='font-medium text-violet-500 cursor-pointer' onClick={() => { setCurrState("Sign up"); }}>Click here</span></p>

          )}
        </div>

      </form>

    </div>
  )
}

export default Login