import React, { useEffect } from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext.jsx'
import {assets} from '../../assets/assets_admin/assets.js'

const Dashboard = () => {
  const {aToken, getDashData, cancelAppointment, dashData, setHighlightedAppointment} = useContext(AdminContext)
  const navigate = useNavigate()
  
  useEffect(() => {
    if(aToken) {
      getDashData()
    }
  }, [aToken, getDashData])

  const handleBookingClick = (appointmentId) => {
    setHighlightedAppointment(appointmentId)
    navigate('/all-appointments')
  }
  
  return dashData ? (
    <div className='p-4 md:p-6 max-w-7xl mx-auto'>
      {/* Statistics Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8'>
        {/* Doctors Card */}
        <div className='flex items-center gap-4 bg-white p-6 rounded-lg border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-sm hover:shadow-md'>
          <div className="p-3 bg-blue-100 rounded-full">
            <img className='w-8 h-8' src={assets.doctor_icon} alt="Doctor Icon"/>
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-700'>{dashData.doctors}</p>
            <p className='text-gray-500 font-medium'>Doctors</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className='flex items-center gap-4 bg-white p-6 rounded-lg border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-sm hover:shadow-md'>
          <div className="p-3 bg-green-100 rounded-full">
            <img className='w-8 h-8' src={assets.appointments_icon} alt="Appointments Icon"/>
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-700'>{dashData.appointments}</p>
            <p className='text-gray-500 font-medium'>Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className='flex items-center gap-4 bg-white p-6 rounded-lg border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-sm hover:shadow-md sm:col-span-2 lg:col-span-1'>
          <div className="p-3 bg-purple-100 rounded-full">
            <img className='w-8 h-8' src={assets.patients_icon} alt="Patients Icon"/>
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-700'>{dashData.patients}</p>
            <p className='text-gray-500 font-medium'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='flex items-center gap-2.5 px-4 md:px-6 py-4 border-b bg-gray-50 rounded-t-lg'>
          <img src={assets.list_icon} alt="List Icon"/>
          <p className='font-semibold text-gray-800'>Latest Bookings</p>
          <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-auto'>Click to view details</span>
        </div>

        <div className='divide-y divide-gray-100'>
          {dashData.latestAppointments && dashData.latestAppointments.map((item, index) => (
            <div 
              className='flex items-center px-4 md:px-6 py-4 gap-3 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-400 hover:shadow-sm' 
              key={index}
              onClick={() => handleBookingClick(item._id)}
              title="Click to view appointment details"
            >
              <img className='rounded-full w-10 h-10 object-cover' src={item.doctorImage} alt="Doctor"/>
              <div className='flex-1 text-sm min-w-0'>
                <p className='text-gray-800 font-medium truncate'>{item.doctorName}</p>
                <p className='text-gray-600 text-xs md:text-sm'>{item.date}</p>
              </div>
              <div className='flex items-center gap-2 flex-shrink-0'>
                {item.status === 'cancelled' ? 
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p> : 
                  item.status === 'completed' ? 
                  <p className='text-green-500 text-xs font-medium'>Completed</p> :
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      cancelAppointment(item._id)
                    }} 
                    className='w-8 h-8 flex items-center justify-center hover:bg-red-100 rounded-full transition-colors' 
                    title="Cancel appointment"
                  >
                    <img className='w-5 h-5' src={assets.cancel_icon} alt="Cancel" />
                  </button>
                }
                <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className='m-5'>
      <p>Loading dashboard data...</p>
    </div>
  )
}

export default Dashboard