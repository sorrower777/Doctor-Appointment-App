import { createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext()
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')? localStorage.getItem('aToken'): '');
    const [doctors, setDoctors] = useState([]);
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
    const value = {
        aToken,setAToken,
        backendUrl, doctors, getAllDoctors, changeAvailability
    }

    return (
        <AdminContext.Provider value = {value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider;