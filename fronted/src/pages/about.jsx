import React from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'

const about = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img src={assets.about_image} alt="About Us" className='w-full md:w-1/2 rounded-lg shadow-lg'/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 '>
          <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records</p>
          <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>
Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-medium'>CHOOSE US</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20 gap-4'>
          <div className='group border-2 border-gray-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:border-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-500 text-gray-600 cursor-pointer rounded-xl bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 relative overflow-hidden'>
              {/* Background Animation */}
              <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500'></div>
              
              {/* Icon */}
              <div className='relative z-10 w-12 h-12 bg-blue-100 group-hover:bg-blue-500 rounded-full flex items-center justify-center mb-2 transition-all duration-300'>
                <svg className='w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              
              <b className='relative z-10 text-lg group-hover:text-blue-700 transition-colors duration-300'>Efficiency</b>
              <p className='relative z-10 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed'>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
              
              {/* Bottom accent line */}
              <div className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-500'></div>
          </div>

          <div className='group border-2 border-gray-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:border-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-500 text-gray-600 cursor-pointer rounded-xl bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 relative overflow-hidden'>
              {/* Background Animation */}
              <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500'></div>
              
              {/* Icon */}
              <div className='relative z-10 w-12 h-12 bg-blue-100 group-hover:bg-blue-500 rounded-full flex items-center justify-center mb-2 transition-all duration-300'>
                <svg className='w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              
              <b className='relative z-10 text-lg group-hover:text-blue-700 transition-colors duration-300'>Convenience</b>
              <p className='relative z-10 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed'>Access to a network of trusted healthcare professionals in your area.</p>
              
              {/* Bottom accent line */}
              <div className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-500'></div>
          </div>

          <div className='group border-2 border-gray-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:border-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-500 text-gray-600 cursor-pointer rounded-xl bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 relative overflow-hidden'>
              {/* Background Animation */}
              <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500'></div>
              
              {/* Icon */}
              <div className='relative z-10 w-12 h-12 bg-blue-100 group-hover:bg-blue-500 rounded-full flex items-center justify-center mb-2 transition-all duration-300'>
                <svg className='w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              
              <b className='relative z-10 text-lg group-hover:text-blue-700 transition-colors duration-300'>Personalization</b>
              <p className='relative z-10 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed'>Tailored recommendations and reminders to help you stay on top of your health.</p>
              
              {/* Bottom accent line */}
              <div className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-500'></div>
          </div>
      </div>
    </div>
  )
}

export default about