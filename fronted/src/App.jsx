import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Navbar from './components/Navbar.jsx'
import About from './pages/about.jsx'
import Appointment from './pages/Appointment.jsx'
import Contact from './pages/contact.jsx'
import Doctors from './pages/doctor.jsx'
import Login from './pages/login.jsx'
import MyAppointments from './pages/myAppointments.jsx'
import MyProfile from './pages/myProfile.jsx'

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
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/appointment' element={<Appointment/>}/>
        <Route path='/appointment/:docid' element={<Appointment/>}/>
        <Route path='/my-appointments' element={<MyAppointments/>}/>
      </Routes>
    </div>
  )
}

export default App