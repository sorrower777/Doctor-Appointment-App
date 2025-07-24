import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useState } from 'react'



const Doctor = () => {
  const {speciality} = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const {doctors} = useContext(AppContext);

  const navigate = useNavigate();
  
  // Function to count available doctors for each specialty
  const getAvailableCount = (spec) => {
    return doctors.filter(doc => 
      doc.speciality === spec && (doc.available !== undefined ? doc.available : true)
    ).length;
  };
  
  const applyFilter = useCallback(() => {
     if(speciality){
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
     }else{
      setFilterDoc(doctors);
     }
  }, [speciality, doctors]);
  useEffect(() => {
    applyFilter();
  }, [speciality, doctors, applyFilter]);

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Find Your Doctor</h1>
        <p className='text-gray-600 text-lg'>Browse through our qualified doctors specializing in {speciality || 'all specialties'}</p>
      </div>
      <div className='flex flex-col lg:flex-row items-start gap-8'>
        <div className='flex lg:flex-col gap-3 text-sm text-gray-600 lg:min-w-[250px] overflow-x-auto lg:overflow-visible pb-2 lg:pb-0'>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`whitespace-nowrap lg:whitespace-normal px-4 py-3 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "General physician" ? "bg-indigo-100 text-indigo-700 border-indigo-300 font-medium": ""}`}>
            General physician <span className='text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-2'>({getAvailableCount('General physician')} available)</span>
          </p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`whitespace-nowrap lg:whitespace-normal px-4 py-3 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Gynecologist" ? "bg-indigo-100 text-indigo-700 border-indigo-300 font-medium": ""}`}>
            Gynecologist <span className='text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-2'>({getAvailableCount('Gynecologist')} available)</span>
          </p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`whitespace-nowrap lg:whitespace-normal px-4 py-3 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Dermatologist" ? "bg-indigo-100 text-indigo-700 border-indigo-300 font-medium": ""}`}>
            Dermatologist <span className='text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-2'>({getAvailableCount('Dermatologist')} available)</span>
          </p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`whitespace-nowrap lg:whitespace-normal px-4 py-3 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Pediatricians" ? "bg-indigo-100 text-indigo-700 border-indigo-300 font-medium": ""}`}>
            Pediatricians <span className='text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-2'>({getAvailableCount('Pediatricians')} available)</span>
          </p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`whitespace-nowrap lg:whitespace-normal px-4 py-3 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Neurologist" ? "bg-indigo-100 text-indigo-700 border-indigo-300 font-medium": ""}`}>
            Neurologist <span className='text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-2'>({getAvailableCount('Neurologist')} available)</span>
          </p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`whitespace-nowrap lg:whitespace-normal px-4 py-3 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-indigo-700 border-indigo-300 font-medium": ""}`}>
            Gastroenterologist <span className='text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-2'>({getAvailableCount('Gastroenterologist')} available)</span>
          </p>
        </div>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {
            filterDoc.map((item, index) => (
                <div 
                  onClick={() => (item.available !== undefined ? item.available : true) && navigate(`/appointment/${item._id}`)} 
                  className={`bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-md group ${
                    (item.available !== undefined ? item.available : true)
                      ? 'cursor-pointer hover:scale-105 hover:shadow-xl hover:border-blue-300' 
                      : 'cursor-not-allowed opacity-75 grayscale-[0.3]'
                  }`} 
                  key={index}
                >
                    <div className='relative overflow-hidden'>
                        <img 
                          className='bg-gradient-to-br from-blue-50 to-indigo-50 w-full h-48 object-cover object-top group-hover:scale-110 transition-transform duration-300' 
                          src={item.image}
                          alt={item.name}
                        />
                        {item.available !== undefined ? (
                            item.available ? (
                                <div className='absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm'>
                                    <div className='w-1.5 h-1.5 bg-white rounded-full animate-pulse'></div>
                                    <span className='font-medium'>Available</span>
                                </div>
                            ) : (
                                <div className='absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm'>
                                    <div className='w-1.5 h-1.5 bg-white rounded-full'></div>
                                    <span className='font-medium'>Unavailable</span>
                                </div>
                            )
                        ) : (
                            <div className='absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm'>
                                <div className='w-1.5 h-1.5 bg-white rounded-full animate-pulse'></div>
                                <span className='font-medium'>Available</span>
                            </div>
                        )}
                    </div>
                    <div className='p-5'>
                        <h3 className='text-gray-900 text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors duration-200'>{item.name}</h3>
                        <p className='text-blue-600 text-sm font-medium mb-2'>{item.speciality}</p>
                        <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                            <div className='flex items-center gap-1 text-yellow-500'>
                                <span className='text-sm'>⭐⭐⭐⭐⭐</span>
                                <span className='text-xs text-gray-500 ml-1'>(4.8)</span>
                            </div>
                            {item.available !== undefined ? (
                                item.available ? (
                                    <button className='text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors duration-200'>
                                        Book Now →
                                    </button>
                                ) : (
                                    <span className='text-gray-400 text-sm font-medium cursor-not-allowed'>
                                        Not Available
                                    </span>
                                )
                            ) : (
                                <button className='text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors duration-200'>
                                    Book Now →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctor
