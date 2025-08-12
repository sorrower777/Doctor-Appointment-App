import React from 'react'
import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext.jsx'
import { assets } from '../../assets/assets_admin/assets.js'

const AllAppointments = () => {
  const {aToken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext)

  useEffect(() => {
    if(aToken) {
      getAllAppointments()
    }
  }, [aToken, getAllAppointments])

  const calculateAge = (dob) => {
    if (!dob || dob === "Not Selected") return "N/A"
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex items-center gap-2'>
              <img 
                className='w-8 rounded-full' 
                src={item.userId?.image || assets.people_icon} 
                alt="patient" 
                onError={(e) => {
                  e.target.src = assets.people_icon
                }}
              /> 
              <p>{item.userId?.name || 'Unknown Patient'}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userId?.dob)}</p>
            <p>{item.date}, {item.time}</p>
            <div className='flex items-center gap-2'>
              <img 
                className='w-8 rounded-full bg-gray-200' 
                src={item.doctorImage} 
                alt="doctor"
                onError={(e) => {
                  e.target.src = assets.doctor_icon
                }}
              />
              <p>{item.doctorName}</p>
            </div>
            <p>${item.fee}</p>
            <div className='flex'>
              {item.status === 'cancelled' ? (
                <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              ) : item.status === 'completed' ? (
                <p className='text-green-400 text-xs font-medium'>Completed</p>
              ) : (
                <img 
                  onClick={() => cancelAppointment(item._id)} 
                  className='w-10 cursor-pointer' 
                  src={assets.cancel_icon} 
                  alt="cancel"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments