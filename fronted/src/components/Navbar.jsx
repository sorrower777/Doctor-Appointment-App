import React from 'react'
import { useState } from 'react'
// import {assets} from '../assets/assets/assets_admin/assets.js'
import { assets } from '../assets/assets/assets_frontend/assets.js'
import { NavLink, useNavigate } from 'react-router-dom'
const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(true);
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b p-4 border-b-gray-400'>
        <img onClick={() =>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />
        <ul className='gap-4 hidden md:flex items-start font-medium'>
            <NavLink to={'/home'}>
                <li className='py-1'>HOME</li> 
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to={'/doctors'}>
                <li className='py-1'>ALL DOCTORS</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to={'/about'}>
                <li className='py-1'>ABOUT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to={'/contact'}>
                <li className='py-1'>CONTACT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
        </ul>
        <div className='flex items-center gap-5'>
            {
                token
                ? <div className='flex items-center gap-2 cursor-pointer relative group' onClick={() => setShowMenu(!showMenu)}>
                    <img className='w-8 rounded-full ' src={assets.profile_pic}/>
                    <img className='w-2.5' src={assets.dropdown_icon}/>
                    <div className='absolute right-0 top-0 pt-14 text-base  font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 '>
                           <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                           <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                           <p onClick = {() => setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                :<button onClick={() => navigate('/login')} className='bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300 hidden md:block'>Create Account</button>
            }
        </div>
    </div>
  )
}

export default Navbar