import React, { useState, useContext } from "react";
import { assets } from "../assets/assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext.jsx";

const MyProfile = () => {
  const { userData, setUserData, updateProfile, isLoading } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const handleSave = async () => {
    // Include the image in the userData before updating
    const dataToUpdate = {
      ...userData,
      image: image || userData.image // Include the selected image or keep existing
    };
    const success = await updateProfile(dataToUpdate);
    if (success) {
      setIsEdit(false);
      setImage(false); // Reset the image state after successful update
    }
  };


  return userData && (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className=" rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-white/80 border border-white/20">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex flex-col items-center">
            <div className="relative flex flex-col items-center">
              {isEdit ? (
                <div className="flex flex-col items-center space-y-3">
                  <label htmlFor="profile_image" className="cursor-pointer">
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gray-100">
                      <img 
                        src={image ? URL.createObjectURL(image) : (userData.image || assets.profile_pic)} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </label>
                  <input 
                    onChange={(e) => {
                      console.log('File selected:', e.target.files[0]);
                      setImage(e.target.files[0]);
                    }} 
                    type="file" 
                    id="profile_image" 
                    accept="image/*"
                    hidden
                  />
                  <p className="text-xs text-white/80 text-center">Click image to change</p>
                </div>
              ) : (
                <img 
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-2xl" 
                  src={userData.image || assets.profile_pic} 
                  alt="Profile"
                />
              )}
            </div>
              <div className="mt-6 text-center">
                {isEdit ? (
                  <input
                    type="text"
                    value={userData.name || ''}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="text-3xl font-bold bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border-2 border-white/30 rounded-xl px-4 py-2 text-center focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all duration-300"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                    {userData.name || 'User'}
                  </h1>
                )}
                <div className="mt-2 flex items-center justify-center">
                  <div className="w-20 h-1 bg-white/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Contact Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                CONTACT INFORMATION
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Email Address
                    </label>
                    {isEdit ? (
                      <input
                        type="email"
                        value={userData.email || ''}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white shadow-sm"
                      />
                    ) : (
                      <p className="text-gray-800 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                        {userData.email || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Phone Number
                    </label>
                    {isEdit ? (
                      <input
                        type="tel"
                        value={userData.phone || ''}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white shadow-sm"
                      />
                    ) : (
                      <p className="text-gray-800 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                        {userData.phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Address
                  </label>
                  {isEdit ? (
                    <div className="space-y-3">
                      <input
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address || {}, line1: e.target.value },
                          }))
                        }
                        value={userData.address?.line1 || ''}
                        type="text"
                        placeholder="Address Line 1"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white shadow-sm"
                      />
                      <input
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address || {}, line2: e.target.value },
                          }))
                        }
                        value={userData.address?.line2 || ''}
                        type="text"
                        placeholder="Address Line 2"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white shadow-sm"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-800 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                      <p>{userData.address?.line1 || 'Not provided'}</p>
                      <p>{userData.address?.line2 || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
                BASIC INFORMATION
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Gender
                  </label>
                  {isEdit ? (
                    <select
                      value={userData.gender || 'Male'}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-white shadow-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-800 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                      {userData.gender || 'Not specified'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Date of Birth
                  </label>
                  {isEdit ? (
                    <input
                      type="date"
                      value={userData.dob || ''}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          dob: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-white shadow-sm"
                    />
                  ) : (
                    <p className="text-gray-800 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                      {userData.dob || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              {isEdit ? (
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="flex items-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Save Changes
                      </>
                    )}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                    Edit Profile
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
