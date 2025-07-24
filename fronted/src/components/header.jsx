import React from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'
import {Link} from 'react-router-dom'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row bg-primary rounded-lg lg:px-20'>
        {/*------------Left Side---------*/}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-40 m-auto md:py-5 md:mb-[30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                Book Appointment<br/>With Trusted Doctors
            </p>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                    <img className='w-24 h-8 object-cover' src={assets.group_profiles} alt="Group profiles"/>
                    <p className='text-base md:text-lg leading-relaxed text-white max-w-lg'>
                        Simply browse through our extensive list of trusted doctors,<br className='hidden sm:block'/> schedule your appointments hassle-free
                    </p>
                </div>
            <a href="#speciality" className='flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors duration-300 w-fit mt-4'>
                Book appointment 
                <img className='w-3 h-3 ml-1' src={assets.arrow_icon} alt="Arrow"/>
            </a>
        </div>
        {/*------------Right Side---------*/}
        <div className='md:w-1/2 relative'>
            <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="Header"/>
        </div>
        
    </div>
  )
}

export default Header