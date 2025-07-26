import React, { useContext } from 'react'
import { useState } from 'react'
// import {assets} from '../assets/assets/assets_admin/assets.js'
import { assets } from '../assets/assets/assets_frontend/assets.js'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { user, logout, isAuthenticated, getUpcomingAppointments } = useContext(AppContext)
    const upcomingAppointments = getUpcomingAppointments()
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b p-4 border-b-gray-400'>
        <img onClick={() =>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />
        <ul className='gap-4 hidden md:flex items-start font-medium'>
            <NavLink to={'/'}>
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
                isAuthenticated()
                ? <div className='flex items-center gap-2 cursor-pointer relative group'>
                    <img className='w-8 rounded-full ' src={assets.profile_pic}/>
                    <img className='w-2.5' src={assets.dropdown_icon}/>
                    <div className='absolute right-0 top-0 pt-14 text-base  font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 '>
                           <p className='text-gray-800 font-medium'>Hello, {user?.name}</p>
                           {upcomingAppointments.length > 0 && (
                             <div className='text-xs text-gray-600 border-b border-gray-300 pb-2'>
                               <p className='font-medium text-green-600'>Next Appointment:</p>
                               <p>{new Date(upcomingAppointments[0].date).toLocaleDateString()}</p>
                               <p>Dr. {upcomingAppointments[0].doctorName}</p>
                             </div>
                           )}
                           <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                           <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>
                             My Appointments 
                             {upcomingAppointments.length > 0 && (
                               <span className='ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
                                 {upcomingAppointments.length}
                               </span>
                             )}
                           </p>
                           <p onClick={() => logout()} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                :<button onClick={() => navigate('/login')} className='bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300 hidden md:block'>Create Account</button>
            }
            <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon}/>
            {/*------Mobile Menu------*/}
            <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300 ease-in-out`}>
              {/* Backdrop */}
              {showMenu && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-25 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>
              )}
              
              {/* Menu Content */}
              <div className="relative z-20 bg-white h-full w-80 ml-auto shadow-2xl">
                <div className='flex items-center justify-between px-5 py-6 border-b border-gray-200'>
                  <img className='w-36' src={assets.logo} alt="Logo"/>
                  <button 
                    onClick={() => setShowMenu(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <img className='w-5' src={assets.cross_icon} alt="Close"/>
                  </button>
                </div>
              
              <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                <NavLink onClick={() => setShowMenu(false)} to="/"><p className='hover:text-primary transition-colors'>HOME</p></NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/doctors"><p className='hover:text-primary transition-colors'>ALL DOCTORS</p></NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/about"><p className='hover:text-primary transition-colors'>ABOUT</p></NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/contact"><p className='hover:text-primary transition-colors'>CONTACT</p></NavLink>
                
                {/* Authentication-based navigation */}
                {isAuthenticated() ? (
                  <>
                    {/* User Profile Section */}
                    <div className='w-full border-t border-gray-200 pt-4 mt-4'>
                      {/* <div className='flex items-center justify-center gap-3 mb-4'>
                        <img className='w-10 h-10 rounded-full object-cover' src={assets.profile_pic} alt="Profile"/>
                        <div className='text-center'>
                          <p className='text-gray-800 font-semibold'>{user?.name}</p>
                          <p className='text-sm text-gray-500'>Welcome back!</p>
                        </div>
                      </div> */}
                      
                      {/* Next Appointment Info */}
                      {upcomingAppointments.length > 0 && (
                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-center'>
                          <p className='text-sm font-medium text-blue-800 mb-1'>Next Appointment</p>
                          <p className='text-xs text-blue-600'>{new Date(upcomingAppointments[0].date).toLocaleDateString()}</p>
                          <p className='text-xs text-blue-600'>Dr. {upcomingAppointments[0].doctorName}</p>
                        </div>
                      )}
                    </div>

                    {/* Authenticated User Menu Items */}
                    <NavLink onClick={() => setShowMenu(false)} to="/my-profile">
                      <p className='hover:text-primary transition-colors'>My Profile</p>
                    </NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to="/my-appointments">
                      <p className='hover:text-primary transition-colors flex items-center gap-2'>
                        My Appointments
                        {upcomingAppointments.length > 0 && (
                          <span className='bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
                            {upcomingAppointments.length}
                          </span>
                        )}
                      </p>
                    </NavLink>
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        logout();
                      }} 
                      className='hover:text-primary transition-colors text-red-600 font-medium mt-2'
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Guest User Menu Items */}
                    <div className='w-full border-t border-gray-200 pt-4 mt-4'></div>
                    <NavLink onClick={() => setShowMenu(false)} to="/login">
                      <p className='hover:text-primary transition-colors'>Login</p>
                    </NavLink>
                    <button 
                      onClick={() => {
                        setShowMenu(false);
                        navigate('/login');
                      }} 
                      className='bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300 mt-2'
                    >
                      Create Account
                    </button>
                  </>
                )}
              </ul>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar