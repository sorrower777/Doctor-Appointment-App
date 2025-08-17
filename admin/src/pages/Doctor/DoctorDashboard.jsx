import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorDashboard = () => {
  
  const { dashData, getDashData, dToken, completeAppointment, cancelAppointment } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken, getDashData])

  return dashData && (
    <div className="m-5">
      
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Earnings */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-blue-800">${dashData.earnings || 0}</p>
              <p className="text-blue-600 text-xs mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <img className="w-6 h-6" src={assets.earning_icon} alt="Earnings" />
            </div>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium mb-1">Total Appointments</p>
              <p className="text-2xl font-bold text-green-800">{dashData.appointments || 0}</p>
              <p className="text-green-600 text-xs mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <img className="w-6 h-6" src={assets.appointments_icon} alt="Appointments" />
            </div>
          </div>
        </div>

        {/* Total Patients */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium mb-1">Total Patients</p>
              <p className="text-2xl font-bold text-purple-800">{dashData.patients || 0}</p>
              <p className="text-purple-600 text-xs mt-1">Unique patients</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <img className="w-6 h-6" src={assets.patients_icon} alt="Patients" />
            </div>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Latest Appointments</h2>
          <span className="text-sm text-gray-500">{dashData.latestAppointments?.length || 0} appointments</span>
        </div>

        <div className="space-y-4">
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <img 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                    src={item.userData?.image || '/default-avatar.png'} 
                    alt="Patient" 
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.userData?.name || 'Unknown Patient'}</p>
                    <p className="text-sm text-gray-600">{item.slotDate} | {item.slotTime}</p>
                    <p className="text-xs text-gray-500">Fee: ${item.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.cancelled ? 'bg-red-100 text-red-800' :
                    item.isCompleted ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Pending'}
                  </span>
                  {!item.cancelled && !item.isCompleted && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => completeAppointment(item._id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Mark as completed"
                      >
                        <img className="w-4 h-4" src={assets.tick_icon} alt="Complete" />
                      </button>
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Cancel appointment"
                      >
                        <img className="w-4 h-4" src={assets.cancel_icon} alt="Cancel" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <img className="w-16 h-16 mx-auto mb-4 opacity-50" src={assets.appointment_icon} alt="No appointments" />
              <p className="text-gray-500 text-lg">No appointments yet</p>
              <p className="text-gray-400 text-sm">Appointments will appear here once patients book with you.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard