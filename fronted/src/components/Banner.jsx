import React from 'react'
import { assets } from '../assets/assets/assets_frontend/assets.js'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()
  return (
    <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        {/*----------Left Side----------*/}
        <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:p1-5'>
            <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                <p>Book Appointment</p>
                <p className='mt-4'>With 100+ Trusted Doctors</p>
            </div>
            <button onClick={() => {navigate('/login');scrollTo(0,0)}} className='bg-white text-primary font-semibold py-3 px-6 rounded-full mt-6 cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-lg active:scale-95'>Create account</button>
        </div>

        {/*----------Right Side----------*/}
        <div className='hidden md:w-1/2 md:block lg:w-[370px] relative'>
            <img className='w-full absolute bottom-0 right-0 max-w-md' src = {assets.appointment_img} alt="Appointment"/>
        </div>
    </div>
  )
}

export default Banner