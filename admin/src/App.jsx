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
import { DoctorContext } from './context/DoctorContext.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';
import { SidebarProvider } from './context/SidebarContext.jsx';

const App = () => {
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <SidebarProvider>
      <div className='bg-[#F8F9FD] min-h-screen'>
        <ToastContainer />
        <Navbar/>
        <div className='flex items-start'>
          <Sidebar/>
          <div className="flex-1 p-4 md:p-8 ml-0 md:ml-0 transition-all duration-300">
            <Routes>
              {/* Admin Routes */}
              <Route path='/' element={<Dashboard/>}/>
              <Route path='/admin-dashboard' element={<Dashboard/>}/>
              <Route path='/all-appointments' element={<AllAppointments/>}/>
              <Route path='/add-doctor' element={<AddDoctor/>}/>
              <Route path='/doctor-list' element={<DoctorList/>}/>
              {/* Doctor Routes */}
              <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
              <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
              <Route path='/doctor-profile' element={<DoctorProfile/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </SidebarProvider>
  ) : (
    <>
      <Login/>
      <ToastContainer />
    </>
  )
}

export default App