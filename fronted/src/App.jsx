import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/home.jsx'
import Navbar from './components/Navbar.jsx'
import About from './pages/about.jsx'
import Appointment from './pages/Appointment.jsx'
import Contact from './pages/contact.jsx'
import Doctors from './pages/doctor.jsx'
import Login from './pages/login.jsx'
import MyAppointments from './pages/myAppointments.jsx'
import MyProfile from './pages/myProfile.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/doctors' element={<Doctors/>}/>
        <Route path='/doctors/:speciality' element={<Doctors/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/my-profile' element={
          <ProtectedRoute>
            <MyProfile/>
          </ProtectedRoute>
        }/>
        <Route path='/appointment' element={
          <ProtectedRoute>
            <Appointment/>
          </ProtectedRoute>
        }/>
        <Route path='/appointment/:docid' element={
          <ProtectedRoute>
            <Appointment/>
          </ProtectedRoute>
        }/>
        <Route path='/my-appointments' element={
          <ProtectedRoute>
            <MyAppointments/>
          </ProtectedRoute>
        }/>
      </Routes>
      <Footer/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App