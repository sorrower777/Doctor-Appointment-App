import React, { useState } from "react";
import { assets } from "../../assets/assets_admin/assets";

const AddDoctor = () => {
    const[doctorImage, setDoctorImage] = useState(false);
    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[experience, setExperience] = useState('1 Year');
    const[fees, setFees] = useState('');
    const[about, setAbout] = useState('');
    const[specialty, setSpecialty] = useState('General physician');
    const[degree, setDegree] = useState('');
    const[address1, setAddress1] = useState('');
    const[address2, setAddress2] = useState('');
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <form className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Add Doctor</h1>
          <p className="text-sm text-gray-600 mt-1">Add a new doctor to your medical practice</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image Upload */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors cursor-pointer">
              <label htmlFor="doctor_image" className="cursor-pointer flex flex-col items-center">
                <img src={doctorImage ? URL.createObjectURL(doctorImage) : assets.upload_area} alt="Upload area" className="w-16 h-16 mb-3 opacity-60" />
                <p className="text-sm text-gray-600 text-center font-medium">
                  Upload Doctor <br /> Picture
                </p>
              </label>
              <input onChange={(e) => setDoctorImage(e.target.files[0])} type="file" id="doctor_image" hidden accept="image/*" />
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                  <input 
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text" 
                    placeholder="Enter doctor's full name" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Email</label>
                  <input 
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email" 
                    placeholder="Enter email address" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Enter secure password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <select onChange={(e) => setExperience(e.target.value)} value={experience} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Select experience</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="4 Years">4 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="6 Years">6 Years</option>
                    <option value="7 Years">7 Years</option>
                    <option value="8 Years">8 Years</option>
                    <option value="9 Years">9 Years</option>
                    <option value="10 Years">10 Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees ($)</label>
                  <input 
                    onChange={(e) => setFees(e.target.value)}
                    value={fees}
                    type="number" 
                    placeholder="Enter fees amount" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <select onChange={(e) => setSpecialty(e.target.value)} value={specialty} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Select specialty</option>
                    <option value="General physician">General Physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                    <option value="Neurologist">Neurologist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <input
                    onChange={(e) => setDegree(e.target.value)}
                    value={degree} 
                    type="text" 
                    placeholder="Enter educational qualifications" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="space-y-2">
                    <input
                      onChange={(e) => setAddress1(e.target.value)}
                      value={address1}
                      type="text"
                      placeholder="Street address / Clinic address"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      onChange={(e) => setAddress2(e.target.value)}
                      value={address2}
                      type="text"
                      placeholder="City, State, ZIP code"
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Doctor */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About Doctor</h3>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write a brief description about the doctor's background, expertise, and approach to patient care..."
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
