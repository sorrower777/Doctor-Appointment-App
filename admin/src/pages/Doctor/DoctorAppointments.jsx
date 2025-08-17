import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorAppointments = () => {
  
  const { appointments, getAppointments, dToken, completeAppointment, cancelAppointment } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken, getAppointments])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="m-5">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage your patient appointments</p>
      </div>

      {/* Filter and Stats */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{appointments?.length || 0}</p>
            <p className="text-sm text-gray-600">Total Appointments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {appointments?.filter(item => item.isCompleted).length || 0}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {appointments?.filter(item => !item.isCompleted && !item.cancelled).length || 0}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {appointments?.filter(item => item.cancelled).length || 0}
            </p>
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">All Appointments</h2>
        </div>
        
        <div className="p-6">
          {appointments && appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    
                    {/* Patient Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <img 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" 
                        src={item.userData?.image || '/default-avatar.png'} 
                        alt="Patient" 
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {item.userData?.name || 'Unknown Patient'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Date:</span>
                            <span>{formatDate(item.slotDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Time:</span>
                            <span>{item.slotTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Fee:</span>
                            <span className="font-semibold text-green-600">${item.amount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Phone:</span>
                            <span>{item.userData?.phone || 'Not provided'}</span>
                          </div>
                        </div>
                        
                        {/* Patient Address */}
                        {item.userData?.address && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Address:</span>
                            <span className="ml-2">
                              {item.userData.address.line1}, {item.userData.address.line2}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Status Badge */}
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        item.cancelled ? 'bg-red-100 text-red-800' :
                        item.isCompleted ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Pending'}
                      </span>

                      {/* Action Buttons */}
                      {!item.cancelled && !item.isCompleted && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => completeAppointment(item._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <img className="w-4 h-4" src={assets.tick_icon} alt="Complete" />
                            Complete
                          </button>
                          <button 
                            onClick={() => cancelAppointment(item._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <img className="w-4 h-4" src={assets.cancel_icon} alt="Cancel" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <img className="w-24 h-24 mx-auto mb-4 opacity-50" src={assets.appointment_icon} alt="No appointments" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You don't have any appointments scheduled. Patients will be able to book appointments with you through the main website.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default DoctorAppointments