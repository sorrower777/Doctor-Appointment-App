import React from 'react'
import Login from './pages/Login'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllAppointments from './pages/Admin/AllAppointments.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  const {aToken} = useContext(AdminContext)
  
  console.log('App rendering, aToken:', aToken); // Debug log
  
  return aToken ? (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <div className="flex-1 p-8">
          <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/admin-dashboard' element={<Dashboard/>}/>
            <Route path='/all-appointments' element={<AllAppointments/>}/>
            <Route path='/add-doctor' element={<AddDoctor/>}/>
            <Route path='/doctor-list' element={<DoctorList/>}/>
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer />
    </>
  )
}

export default App