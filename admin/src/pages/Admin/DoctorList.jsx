import React from 'react'
import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'



const DoctorList = () => {
  const {doctors, aToken, getAllDoctors, changeAvailability} = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aToken])

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">All Doctors</h1>
        <p className="text-gray-600">Manage doctor availability and information</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {
          doctors.map((item, index) => (
            <div key={index} className="bg-white border border-indigo-200 rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img 
                  className="w-full h-full object-cover bg-indigo-50 group-hover:scale-105 transition-all duration-500" 
                  src={item.image} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.innerHTML = 'Image not found';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-gray-800 text-lg font-semibold mb-1 truncate" title={item.name}>
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 truncate" title={item.speciality}>
                  {item.speciality}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      onChange={() => changeAvailability(item._id)} 
                      type="checkbox" 
                      checked={item.available}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Available</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      
      {doctors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500">Add some doctors to get started</p>
        </div>
      )}
    </div>
  )
}

export default DoctorList