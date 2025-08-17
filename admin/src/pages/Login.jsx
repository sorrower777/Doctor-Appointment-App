import React,{useState,useContext} from 'react'
import { assets } from '../assets/assets_admin/assets.js'
import { AdminContext } from '../context/AdminContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext.jsx'

const Login = () => {

    const [state, setState] = useState('Admin')

    const handleToggle = () => {
        setState(state === 'Admin' ? 'Doctor' : 'Admin')
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAToken, backendUrl } = useContext(AdminContext);
    const {setDToken} = useContext(DoctorContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try{
            if(state === 'Admin'){
                const {data} = await axios.post(backendUrl + '/api/admin/login',{email,password})
                if(data.success){
                    setAToken(data.token)
                    localStorage.setItem('aToken', data.token)
                    console.log('Admin token:', data.token)
                }
                else{
                    toast.error(data.message || 'Login failed')
                }
            }
            else{
                const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password})
                if(data.success){
                    localStorage.setItem('dToken', data.token)
                    setDToken(data.token)
                    console.log(data.token)
                }
                else{
                    toast.error(data.message || 'Login failed')
                }
            }
        }
        catch(error){
            if(error.response && error.response.data){
                alert(error.response.data.message)
            }
            else{
                alert('Something went wrong')
            }
        }
    }
  return (
    <form onSubmit={onSubmitHandler} className='flex min-h-[88vh] items-center' >
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
            <div>
                <img src={assets.admin_logo} alt="Admin Logo" />
            </div>
            <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
            <div className='w-full'>
                <p>Email</p>
                <input onChange ={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" placeholder='Enter your email' />
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input onChange ={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" placeholder='Enter your password' />
            </div>
            <button className='bg-primary text-white rounded w-full py-2 mt-4 text-base cursor-pointer'>Login</button>
            
            <div className='w-full text-center mt-4 pt-4 border-t border-gray-200'>
                <p className='text-gray-600 mb-3'>
                    Switch to <span className='font-semibold text-primary'>{state === 'Admin' ? 'Doctor' : 'Admin'}</span> login
                </p>
                <button 
                    type="button" 
                    onClick={handleToggle}
                    className='bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg px-6 py-2 text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50'
                >
                    Switch to {state === 'Admin' ? 'Doctor' : 'Admin'}
                </button>
            </div>
        </div>
    </form>
  )
}

export default Login