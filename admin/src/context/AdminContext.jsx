import { createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext()
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";


const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')? localStorage.getItem('aToken'): '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors', {}, {headers: {aToken}})
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors)
            }
            else{
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }
    const changeAvailability = async (doctorId) => {
        try{
            const {data} = await axios.post(backendUrl + '/api/admin/change-availability', {doctorId}, {headers: {aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            }else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', {headers:{aToken}})
            if (data.success){
                setAppointments(data.appointments)
                console.log(data.appointments)
            }else {
                toast.error(data.message)
            }
        }
        catch(error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', {appointmentId}, {headers:{aToken}})
            if (data.success){
                toast.success(data.message)
                getAllAppointments()
            }else {
                toast.error(data.message)
                console.log(data.dashData)
            }
        }
        catch(error) {
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/dashboard', {headers: {aToken}})
            if(data.success){
                setDashData(data.dashData)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken,setAToken,
        backendUrl, doctors, getAllDoctors, changeAvailability,
        appointments, setAppointments, getAllAppointments, cancelAppointment,
        getDashData, dashData

    }

    return (
        <AdminContext.Provider value = {value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider;