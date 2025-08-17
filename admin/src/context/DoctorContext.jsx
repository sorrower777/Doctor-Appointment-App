import { createContext } from "react";
import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // State variables
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [doctorData, setDoctorData] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(null)
    const [profileData, setProfileData] = useState(null)

    // Get doctor profile data
    const getProfileData = useCallback(async () => {
        try {
            if (!dToken) return
            
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
                headers: { dtoken: dToken }
            })
            if (data.success) {
                setProfileData(data.profileData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }, [dToken, backendUrl])

    // Get doctor appointments
    const getAppointments = useCallback(async () => {
        try {
            if (!dToken) return
            
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
                headers: { dtoken: dToken }
            })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }, [dToken, backendUrl])

    // Get dashboard data
    const getDashData = useCallback(async () => {
        try {
            if (!dToken) return
            
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', {
                headers: { dtoken: dToken }
            })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }, [dToken, backendUrl])

    // Complete appointment
    const completeAppointment = useCallback(async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', 
                { appointmentId }, 
                { headers: { dtoken: dToken } }
            )
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }, [dToken, backendUrl, getAppointments, getDashData])

    // Cancel appointment
    const cancelAppointment = useCallback(async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', 
                { appointmentId }, 
                { headers: { dtoken: dToken } }
            )
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }, [dToken, backendUrl, getAppointments, getDashData])

    // Update profile
    const updateProfile = useCallback(async (profileUpdate) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', 
                profileUpdate, 
                { headers: { dtoken: dToken } }
            )
            if (data.success) {
                toast.success(data.message)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }, [dToken, backendUrl, getProfileData])

    const value = {
        dToken, setDToken,
        backendUrl,
        doctorData, setDoctorData,
        appointments, setAppointments, getAppointments,
        dashData, getDashData,
        profileData, getProfileData, updateProfile,
        completeAppointment, cancelAppointment
    }

    return (
        <DoctorContext.Provider value = {value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;
export { DoctorContext };