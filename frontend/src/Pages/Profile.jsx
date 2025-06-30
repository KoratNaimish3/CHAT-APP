import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

function Profile() {

  const { axios, setAuthUser, setOnlineUser, socket, authUser } = useAppContext()

  const [selectedImage, setSelectedImage] = useState(null)
  const [name, setName] = useState(authUser?.fullName || '')
  const [bio, setBio] = useState(authUser?.bio || '')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('fullName', name)
      formData.append('bio', bio)

      const { data } = await axios.put('/api/auth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        setAuthUser(data.user)
        toast.success(data.message)
        navigate('/')
      }

    } catch (error) {
      console.error(" error in  update profile (axios)", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      }
      else {
        toast.error("An unexpected error occurred. Please try again.");
      }

    }
  }



  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center text-white'>


      <div className='border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg max-w-2xl w-5/6 backdrop-blur-2xl text-gray-300 max-sm:w-auto'>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>

          <label htmlFor="avtar" className='flex items-center gap-3 cursor-pointer'>
            <input type="file" id='avtar' accept='.png, .jpg, .jpeg' hidden onChange={(e) => setSelectedImage(e.target.files[0])} />

            <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImage && 'rounded-full'}`} />

            upload Profile Image

          </label>

          <input type="text" placeholder='Your Name' className='border border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500' onChange={(e) => setName(e.target.value)} value={name} />

          <textarea placeholder='Write Profile Bio' className='border border-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4} onChange={(e) => setBio(e.target.value)} value={bio}></textarea>


          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 p-2 text-lg text-white rounded-full cursor-pointer'>
            save
          </button>

        </form>


        <img src={authUser?.profilePic || assets.logo_icon} alt="" className={`max-w-44 mx-10 aspect-square rounded-full max-sm:mt-10`} />

      </div>

    </div>
  )

}
export default Profile