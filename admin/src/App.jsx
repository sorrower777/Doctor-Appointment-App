import React from 'react'
import Login from './pages/Login'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
const App = () => {
  const {aToken} = useContext(AdminContext)
  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer />
    </>
  )
}

export default App