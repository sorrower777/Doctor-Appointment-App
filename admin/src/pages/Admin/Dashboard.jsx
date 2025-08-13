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
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        {/* Doctors Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="Doctor Icon"/>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="Appointments Icon"/>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="Patients Icon"/>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="List Icon"/>
          <p className='font-semibold'>Latest Bookings</p>
          <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-auto'>Click to view details</span>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments && dashData.latestAppointments.map((item, index) => (
            <div 
              className='flex items-center px-6 py-3 gap-3 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-400 hover:shadow-sm' 
              key={index}
              onClick={() => handleBookingClick(item._id)}
              title="Click to view appointment details"
            >
              <img className='rounded-full w-10' src={item.doctorImage} alt="Doctor"/>
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.doctorName}</p>
                <p className='text-gray-600'>{item.date}</p>
              </div>
              <div className='flex items-center gap-2'>
                {item.status === 'cancelled' ? 
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p> : 
                  item.status === 'completed' ? 
                  <p className='text-green-500 text-xs font-medium'>Completed</p> :
                  <img 
                    onClick={(e) => {
                      e.stopPropagation()
                      cancelAppointment(item._id)
                    }} 
                    className='w-10 cursor-pointer hover:scale-110 transition-transform' 
                    src={assets.cancel_icon} 
                    alt="Cancel"
                  />
                }
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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