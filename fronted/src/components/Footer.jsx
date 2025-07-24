import React from 'react'
import { assets } from '../assets/assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          {/*----Left Section----*/}
            <img className='mb-5 w-40' src={assets.logo}/>
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>It usually begins with: “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.” The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout.</p>
        </div>
        <div>
          {/*----Center Section----*/}
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li className='cursor-pointer hover:text-blue-600 hover:translate-x-2 transition-all duration-300 ease-in-out'>Home</li>
                <li className='cursor-pointer hover:text-blue-600 hover:translate-x-2 transition-all duration-300 ease-in-out'>About</li>
                <li className='cursor-pointer hover:text-blue-600 hover:translate-x-2 transition-all duration-300 ease-in-out'>Contact us</li>
                <li className='cursor-pointer hover:text-blue-600 hover:translate-x-2 transition-all duration-300 ease-in-out'>Privacy policy</li>
            </ul>
        </div>
        <div>
          {/*----Right Section----*/}
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+1-212-456-7890</li>
                <li>info@company.com</li>
            </ul>
        </div>
      </div>
      <div>
        <hr/>
        <p className='py-5 text-sm text-center text-gray-600'>Copyright © 2023 Zocdoc . All rights reserved.</p>
      </div>
    </div>
  )
};

export default Footer