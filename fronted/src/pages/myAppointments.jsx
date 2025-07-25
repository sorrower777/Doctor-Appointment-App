import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets/assets_frontend/assets'
import { toast } from 'react-toastify'

const MyAppointments = () => {
  const { getUserAppointments, cancelAppointment, isAuthenticated, user } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'upcoming', 'past'
  const [sortBy, setSortBy] = useState('date') // 'date', 'doctor', 'speciality'
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    
    const userAppointments = getUserAppointments()
    setAppointments(userAppointments)
    setFilteredAppointments(userAppointments)
  }, [getUserAppointments, isAuthenticated, navigate])

  useEffect(() => {
    let filtered = [...appointments]
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Apply filter
    if (filter === 'upcoming') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.date)
        aptDate.setHours(0, 0, 0, 0)
        return aptDate >= today
      })
    } else if (filter === 'past') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.date)
        aptDate.setHours(0, 0, 0, 0)
        return aptDate < today
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
      } else if (sortBy === 'doctor') {
        return a.doctorName.localeCompare(b.doctorName)
      } else if (sortBy === 'speciality') {
        return a.speciality.localeCompare(b.speciality)
      }
      return 0
    })

    setFilteredAppointments(filtered)
  }, [appointments, filter, sortBy])

  const handleCancelAppointment = (appointmentId, doctorName) => {
    if (window.confirm(`Are you sure you want to cancel your appointment with Dr. ${doctorName}?`)) {
      const success = cancelAppointment(appointmentId)
      if (success) {
        // Update local state
        const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId)
        setAppointments(updatedAppointments)
        toast.success(`Appointment with Dr. ${doctorName} cancelled successfully`)
      }
    }
  }

  const getAppointmentStatus = (date, time) => {
    const appointmentDateTime = new Date(date + ' ' + time)
    const now = new Date()
    
    if (appointmentDateTime < now) {
      return { status: 'completed', color: 'text-gray-500', bg: 'bg-gray-100' }
    } else if (appointmentDateTime.toDateString() === now.toDateString()) {
      return { status: 'today', color: 'text-orange-600', bg: 'bg-orange-100' }
    } else {
      return { status: 'upcoming', color: 'text-green-600', bg: 'bg-green-100' }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (!isAuthenticated()) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Please Login</h2>
          <p className='text-gray-600 mb-6'>You need to login to view your appointments</p>
          <button 
            onClick={() => navigate('/login')}
            className='bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300'
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto p-4 sm:p-6 lg:p-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Appointments</h1>
        <p className='text-gray-600'>Welcome back, {user?.name}! Manage all your appointments here.</p>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-blue-50 border border-blue-200 rounded-xl p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-600 text-sm font-medium'>Total Appointments</p>
              <p className='text-2xl font-bold text-blue-800'>{appointments.length}</p>
            </div>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              📅
            </div>
          </div>
        </div>

        <div className='bg-green-50 border border-green-200 rounded-xl p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-green-600 text-sm font-medium'>Upcoming</p>
              <p className='text-2xl font-bold text-green-800'>
                {appointments.filter(apt => new Date(apt.date) >= new Date().setHours(0,0,0,0)).length}
              </p>
            </div>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              ⏰
            </div>
          </div>
        </div>

        <div className='bg-purple-50 border border-purple-200 rounded-xl p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-600 text-sm font-medium'>Specialists</p>
              <p className='text-2xl font-bold text-purple-800'>
                {new Set(appointments.map(apt => apt.speciality)).size}
              </p>
            </div>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
              🏥
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({appointments.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                filter === 'upcoming' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming ({appointments.filter(apt => new Date(apt.date) >= new Date().setHours(0,0,0,0)).length})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                filter === 'past' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Past ({appointments.filter(apt => new Date(apt.date) < new Date().setHours(0,0,0,0)).length})
            </button>
          </div>

          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium text-gray-700'>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="date">Date</option>
              <option value="doctor">Doctor</option>
              <option value="speciality">Speciality</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
          <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            📋
          </div>
          <h3 className='text-xl font-semibold text-gray-800 mb-2'>
            {filter === 'all' ? 'No Appointments Yet' : `No ${filter} Appointments`}
          </h3>
          <p className='text-gray-600 mb-6'>
            {filter === 'all' 
              ? 'Start by booking your first appointment with one of our specialists.' 
              : `You don't have any ${filter} appointments.`}
          </p>
          <button
            onClick={() => navigate('/doctors')}
            className='bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300'
          >
            Book Appointment
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredAppointments.map((appointment, index) => {
            const status = getAppointmentStatus(appointment.date, appointment.time)
            const isUpcoming = status.status === 'upcoming' || status.status === 'today'
            
            return (
              <div key={index} className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
                <div className='p-6'>
                  <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Doctor Image */}
                    <div className='lg:w-24 lg:h-24 w-20 h-20 mx-auto lg:mx-0 flex-shrink-0'>
                      <img
                        src={appointment.doctorImage}
                        alt={appointment.doctorName}
                        className='w-full h-full object-cover rounded-xl'
                        onError={(e) => {
                          e.target.style.backgroundColor = '#f0f0f0'
                          e.target.innerHTML = '👨‍⚕️'
                          e.target.style.display = 'flex'
                          e.target.style.alignItems = 'center'
                          e.target.style.justifyContent = 'center'
                          e.target.style.fontSize = '2rem'
                        }}
                      />
                    </div>

                    {/* Appointment Details */}
                    <div className='flex-1 space-y-4'>
                      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <h3 className='text-xl font-semibold text-gray-800'>Dr. {appointment.doctorName}</h3>
                            <img src={assets.verified_icon} alt="Verified" className='w-5 h-5' />
                          </div>
                          <p className='text-blue-600 font-medium'>{appointment.speciality}</p>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                          {status.status === 'completed' && '✅ Completed'}
                          {status.status === 'today' && '🔥 Today'}
                          {status.status === 'upcoming' && '⏰ Upcoming'}
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div className='flex items-center gap-2'>
                          <span className='text-gray-500'>📅</span>
                          <span className='font-medium'>{formatDate(appointment.date)}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='text-gray-500'>⏰</span>
                          <span className='font-medium'>{appointment.time}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='text-gray-500'>💰</span>
                          <span className='font-medium'>${appointment.fee}</span>
                        </div>
                      </div>

                      <div className='flex items-center gap-2 text-sm'>
                        <span className='text-gray-500'>📍</span>
                        <span className='text-gray-700'>{appointment.address?.line1}, {appointment.address?.line2}</span>
                      </div>

                      <div className='flex items-center gap-2 text-xs text-gray-500'>
                        <span>🆔 {appointment.id}</span>
                        <span>•</span>
                        <span>Booked on {new Date(appointment.bookedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='flex flex-col gap-2 lg:w-40'>
                      <button
                        onClick={() => navigate(`/appointment/${appointment.doctorId}`)}
                        className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200'
                      >
                        View Doctor
                      </button>
                      {isUpcoming && (
                        <button
                          onClick={() => handleCancelAppointment(appointment.id, appointment.doctorName)}
                          className='bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200'
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className='mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h3>
        <div className='flex flex-wrap gap-3'>
          <button
            onClick={() => navigate('/doctors')}
            className='bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-4 rounded-lg border border-blue-200 transition duration-200'
          >
            Book New Appointment
          </button>
          <button
            onClick={() => navigate('/my-profile')}
            className='bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-4 rounded-lg border border-blue-200 transition duration-200'
          >
            Update Profile
          </button>
          <button
            onClick={() => navigate('/contact')}
            className='bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-4 rounded-lg border border-blue-200 transition duration-200'
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyAppointments