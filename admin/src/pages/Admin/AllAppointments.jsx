import React from 'react'
import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext.jsx'
import { assets } from '../../assets/assets_admin/assets.js'

const AllAppointments = () => {
  const {aToken, appointments, getAllAppointments, cancelAppointment, deleteAppointment, cleanupOldAppointments, markPastAppointmentsCompleted, highlightedAppointment, setHighlightedAppointment} = useContext(AdminContext)

  useEffect(() => {
    if(aToken) {
      getAllAppointments()
    }
  }, [aToken, getAllAppointments])

  useEffect(() => {
    // Clear highlighted appointment after 3 seconds and scroll to it
    if (highlightedAppointment) {
      // Scroll to highlighted appointment
      setTimeout(() => {
        const highlightedElement = document.getElementById(`appointment-${highlightedAppointment}`)
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }, 100)
      
      const timer = setTimeout(() => {
        setHighlightedAppointment(null)
      }, 5000) // Increased to 5 seconds
      return () => clearTimeout(timer)
    }
  }, [highlightedAppointment, setHighlightedAppointment])

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
      {highlightedAppointment && (
        <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2'>
          <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
          <p className='text-blue-700 text-sm font-medium'>Showing appointment from dashboard click</p>
        </div>
      )}
      <div className='flex justify-between items-center mb-3'>
        <p className='text-lg font-medium'>All Appointments</p>
        <div className='flex gap-2'>
          <button 
            onClick={markPastAppointmentsCompleted}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm'
            title="Mark past appointments as completed"
          >
            Mark Past Complete
          </button>
          <button 
            onClick={cleanupOldAppointments}
            className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm'
            title="Remove completed/cancelled appointments older than 30 days"
          >
            Cleanup Old
          </button>
          <span className='text-xs text-gray-500 self-center'>
            Total: {appointments.length}
          </span>
        </div>
      </div>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        {/* Desktop Table Header */}
        <div className='hidden md:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-50'>
          <p className="font-semibold text-gray-700">#</p>
          <p className="font-semibold text-gray-700">Patient</p>
          <p className="font-semibold text-gray-700">Age</p>
          <p className="font-semibold text-gray-700">Date & Time</p>
          <p className="font-semibold text-gray-700">Doctor</p>
          <p className="font-semibold text-gray-700">Fees</p>
          <p className="font-semibold text-gray-700">Actions</p>
        </div>
        
        {appointments.map((item, index) => {
          const isHighlighted = highlightedAppointment === item._id
          return (
            <div key={index}>
              {/* Desktop View */}
              <div 
                id={`appointment-${item._id}`}
                className={`hidden md:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b transition-all duration-500 ${
                  isHighlighted 
                    ? 'bg-blue-50 border-blue-200 shadow-md transform scale-[1.02]' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <p>{index+1}</p>
                <div className='flex items-center gap-2'>
                  <img 
                    className='w-8 rounded-full' 
                    src={item.userId?.image || assets.people_icon} 
                    alt="patient" 
                    onError={(e) => {
                      e.target.src = assets.people_icon
                    }}
                  /> 
                  <p className={isHighlighted ? 'font-semibold text-blue-600' : ''}>{item.userId?.name || 'Unknown Patient'}</p>
                  {isHighlighted && <span className='text-blue-500 text-xs bg-blue-100 px-2 py-1 rounded-full'>From Dashboard</span>}
                </div>
                <p>{calculateAge(item.userId?.dob)}</p>
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
                <div className='flex gap-1'>
                  {item.status === 'cancelled' ? (
                    <div className='flex flex-col items-center gap-1'>
                      <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                      <img 
                        onClick={() => deleteAppointment(item._id)} 
                        className='w-6 cursor-pointer hover:scale-110 transition-transform' 
                        src={assets.cancel_icon} 
                        alt="delete permanently"
                        title="Delete permanently"
                      />
                    </div>
                  ) : item.status === 'completed' ? (
                    <div className='flex flex-col items-center gap-1'>
                      <p className='text-green-400 text-xs font-medium'>Completed</p>
                      <img 
                        onClick={() => deleteAppointment(item._id)} 
                        className='w-6 cursor-pointer hover:scale-110 transition-transform' 
                        src={assets.cancel_icon} 
                        alt="delete permanently"
                        title="Delete permanently"
                      />
                    </div>
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

              {/* Mobile View */}
              <div 
                id={`appointment-mobile-${item._id}`}
                className={`md:hidden p-4 border-b transition-all duration-500 ${
                  isHighlighted 
                    ? 'bg-blue-50 border-blue-200 shadow-md' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="space-y-3">
                  {/* Patient Info */}
                  <div className="flex items-center justify-between">
                    <div className='flex items-center gap-3'>
                      <img 
                        className='w-10 h-10 rounded-full' 
                        src={item.userId?.image || assets.people_icon} 
                        alt="patient" 
                        onError={(e) => {
                          e.target.src = assets.people_icon
                        }}
                      /> 
                      <div>
                        <p className={`font-medium ${isHighlighted ? 'text-blue-600' : 'text-gray-800'}`}>
                          {item.userId?.name || 'Unknown Patient'}
                        </p>
                        <p className="text-sm text-gray-500">Age: {calculateAge(item.userId?.dob)}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">#{index+1}</span>
                  </div>

                  {/* Appointment Details */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Date & Time</p>
                        <p className="font-medium">{item.date}, {item.time}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fee</p>
                        <p className="font-medium text-green-600">${item.fee}</p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className='flex items-center gap-3'>
                    <img 
                      className='w-8 h-8 rounded-full bg-gray-200' 
                      src={item.doctorImage} 
                      alt="doctor"
                      onError={(e) => {
                        e.target.src = assets.doctor_icon
                      }}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-medium">{item.doctorName}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex justify-end pt-2'>
                    {item.status === 'cancelled' ? (
                      <div className='flex items-center gap-2'>
                        <span className='text-red-500 text-sm font-medium'>Cancelled</span>
                        <button 
                          onClick={() => deleteAppointment(item._id)} 
                          className='bg-red-100 hover:bg-red-200 p-2 rounded-lg transition-colors'
                          title="Delete permanently"
                        >
                          <img className='w-4 h-4' src={assets.cancel_icon} alt="delete permanently" />
                        </button>
                      </div>
                    ) : item.status === 'completed' ? (
                      <div className='flex items-center gap-2'>
                        <span className='text-green-500 text-sm font-medium'>Completed</span>
                        <button 
                          onClick={() => deleteAppointment(item._id)} 
                          className='bg-red-100 hover:bg-red-200 p-2 rounded-lg transition-colors'
                          title="Delete permanently"
                        >
                          <img className='w-4 h-4' src={assets.cancel_icon} alt="delete permanently" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => cancelAppointment(item._id)} 
                        className='bg-red-100 hover:bg-red-200 p-2 rounded-lg transition-colors'
                        title="Cancel appointment"
                      >
                        <img className='w-5 h-5' src={assets.cancel_icon} alt="cancel" />
                      </button>
                    )}
                  </div>

                  {/* Highlight indicator */}
                  {isHighlighted && (
                    <div className="text-center">
                      <span className='text-blue-500 text-xs bg-blue-100 px-3 py-1 rounded-full'>
                        Viewed from Dashboard
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
        )})}
      </div>
    </div>
  )
}

export default AllAppointments