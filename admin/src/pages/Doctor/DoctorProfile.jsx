import React, { useContext, useEffect, useState, useRef } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorProfile = () => {
  
  const { profileData, getProfileData, dToken, updateProfile } = useContext(DoctorContext)
  
  // Form states
  const [isEdit, setIsEdit] = useState(false)
  const [fees, setFees] = useState('')
  const [address, setAddress] = useState({})
  const [available, setAvailable] = useState(false)
  
  // Image upload states
  const [previewImage, setPreviewImage] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken, getProfileData])

  useEffect(() => {
    if (profileData) {
      setFees(profileData.fees || '')
      setAddress(profileData.address || {})
      setAvailable(profileData.available || false)
      setPreviewImage(profileData.image || '')
    }
  }, [profileData])

  // Handle image file selection
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Create preview URL immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target.result)
    }
    reader.readAsDataURL(file)

    // Upload image immediately
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const response = await fetch(`${profileData.backendUrl || 'http://localhost:4000'}/api/doctor/upload-image`, {
        method: 'POST',
        headers: {
          'dtoken': dToken
        },
        body: formData
      })
      
      const data = await response.json()
      if (data.success) {
        // Update the preview image with uploaded URL
        setPreviewImage(data.imageUrl)
        // Refresh profile data to get the updated image
        await getProfileData()
        alert('Image uploaded successfully!')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('Failed to upload image. Please try again.')
      // Reset preview to original image on error
      setPreviewImage(profileData.image || '')
    }
  }

  const updateProfileHandler = async () => {
    try {      
      await updateProfile({
        fees,
        address,
        available
      })
      
      setIsEdit(false)
    } catch (error) {
      console.log(error)
    }
  }

  return profileData && (
    <div className="m-5">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor Profile</h1>
        <p className="text-gray-600">View and update your professional information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              
              <div className="relative mb-4">
                <img 
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200 cursor-pointer transition-all duration-200 hover:border-blue-400 block" 
                  src={previewImage || profileData.image || 'https://via.placeholder.com/150x150/cccccc/666666?text=Doctor'} 
                  alt="Doctor" 
                  onClick={handleImageClick}
                  key={previewImage || profileData.image} // Force re-render when URL changes
                  style={{ 
                    width: '128px',
                    height: '128px',
                    objectFit: 'cover',
                    backgroundColor: '#f0f0f0'
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully')
                  }}
                  onError={(e) => {
                    console.log('Image load error, using fallback')
                    e.target.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=Error'
                  }}
                />
                {/* Simple text hint below image */}
                <p className="text-xs text-gray-500 text-center mt-2 opacity-0 hover:opacity-100 transition-opacity">Click to change photo</p>
                
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{profileData.name}</h2>
              <p className="text-lg text-blue-600 font-medium mb-2">{profileData.speciality}</p>
              <p className="text-gray-600 mb-4">{profileData.degree}</p>
              
              {/* Experience Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-4">
                <span className="font-medium">{profileData.experience} Years Experience</span>
              </div>
              
              {/* Availability Status */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className={`font-medium ${available ? 'text-green-600' : 'text-gray-600'}`}>
                  {available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            
            {/* Edit Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Professional Information</h3>
              <button 
                onClick={() => setIsEdit(!isEdit)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isEdit ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-6">
              
              {/* About Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{profileData.about}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{profileData.email}</p>
                </div>
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee</label>
                {isEdit ? (
                  <input 
                    type="number" 
                    value={fees} 
                    onChange={(e) => setFees(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter consultation fee"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 font-semibold">${profileData.fees}</p>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Address</label>
                {isEdit ? (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={address.line1 || ''} 
                      onChange={(e) => setAddress(prev => ({...prev, line1: e.target.value}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Address Line 1"
                    />
                    <input 
                      type="text" 
                      value={address.line2 || ''} 
                      onChange={(e) => setAddress(prev => ({...prev, line2: e.target.value}))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Address Line 2"
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{profileData.address?.line1}</p>
                    {profileData.address?.line2 && (
                      <p className="text-gray-700">{profileData.address.line2}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Availability Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
                {isEdit ? (
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={available}
                        onChange={(e) => setAvailable(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-gray-700">
                      {available ? 'Available for appointments' : 'Not available for appointments'}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${profileData.available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-gray-700">
                        {profileData.available ? 'Available for appointments' : 'Not available for appointments'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              {isEdit && (
                <div className="pt-4">
                  <button 
                    onClick={updateProfileHandler}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DoctorProfile