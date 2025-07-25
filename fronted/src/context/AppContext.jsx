import React, { createContext, useState, useEffect } from 'react'
import { doctors } from '../assets/assets/assets_frontend/assets'
import { toast } from 'react-toastify'

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [isLoading, setIsLoading] = useState(false)
    const [appointments, setAppointments] = useState([])

    // Load user data and appointments from localStorage on app start
    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser && token) {
            setUser(JSON.parse(savedUser))
        }
        
        // Load user's appointments
        const savedAppointments = localStorage.getItem('appointments')
        if (savedAppointments && token) {
            setAppointments(JSON.parse(savedAppointments))
        }
        
        // Initialize demo users if not exists
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
        if (existingUsers.length === 0) {
            const demoUsers = [
                {
                    id: 1,
                    name: 'Demo User',
                    email: 'demo@example.com',
                    password: 'demo123',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'john123',
                    createdAt: new Date().toISOString()
                }
            ]
            localStorage.setItem('users', JSON.stringify(demoUsers))
        }
    }, [token])

    // Register function
    const register = async (userData) => {
        setIsLoading(true)
        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Check if user already exists (simulate)
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
            const userExists = existingUsers.find(u => u.email === userData.email)
            
            if (userExists) {
                toast.error('User already exists with this email!')
                setIsLoading(false)
                return false
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                password: userData.password, // In real app, this should be hashed
                createdAt: new Date().toISOString()
            }

            // Save to localStorage (simulate database)
            existingUsers.push(newUser)
            localStorage.setItem('users', JSON.stringify(existingUsers))

            // Generate token (simulate)
            const userToken = `token_${newUser.id}_${Date.now()}`
            
            // Set user data
            const userInfo = { id: newUser.id, name: newUser.name, email: newUser.email }
            setUser(userInfo)
            setToken(userToken)
            
            // Save to localStorage
            localStorage.setItem('token', userToken)
            localStorage.setItem('user', JSON.stringify(userInfo))
            
            toast.success('Account created successfully!')
            setIsLoading(false)
            return true
        } catch (error) {
            console.error('Registration error:', error)
            toast.error('Registration failed. Please try again.')
            setIsLoading(false)
            return false
        }
    }

    // Login function
    const login = async (loginData) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Check credentials (simulate)
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
            const foundUser = existingUsers.find(u => 
                u.email === loginData.email && u.password === loginData.password
            )

            if (!foundUser) {
                toast.error('Invalid email or password!')
                setIsLoading(false)
                return false
            }

            // Generate token
            const userToken = `token_${foundUser.id}_${Date.now()}`
            
            // Set user data
            const userInfo = { id: foundUser.id, name: foundUser.name, email: foundUser.email }
            setUser(userInfo)
            setToken(userToken)
            
            // Save to localStorage
            localStorage.setItem('token', userToken)
            localStorage.setItem('user', JSON.stringify(userInfo))
            
            toast.success('Login successful!')
            setIsLoading(false)
            return true
        } catch (error) {
            console.error('Login error:', error)
            toast.error('Login failed. Please try again.')
            setIsLoading(false)
            return false
        }
    }

    // Logout function
    const logout = () => {
        setUser(null)
        setToken(null)
        setAppointments([])
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('appointments')
        toast.success('Logged out successfully!')
    }

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!(user && token)
    }

    // Book appointment function
    const bookAppointment = (appointmentData) => {
        if (!isAuthenticated()) {
            toast.error('Please login to book appointments')
            return false
        }

        const newAppointment = {
            id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: user.id,
            doctorId: appointmentData.doctorId,
            doctorName: appointmentData.doctorName,
            doctorImage: appointmentData.doctorImage,
            speciality: appointmentData.speciality,
            date: appointmentData.date,
            time: appointmentData.time,
            fee: appointmentData.fee,
            status: 'confirmed',
            bookedAt: new Date().toISOString(),
            address: appointmentData.address
        }

        const updatedAppointments = [...appointments, newAppointment]
        setAppointments(updatedAppointments)
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments))
        
        toast.success(`Appointment booked successfully with Dr. ${appointmentData.doctorName}!`)
        return newAppointment
    }

    // Cancel appointment function
    const cancelAppointment = (appointmentId) => {
        const appointment = appointments.find(apt => apt.id === appointmentId)
        if (!appointment) {
            toast.error('Appointment not found')
            return false
        }

        const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId)
        setAppointments(updatedAppointments)
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments))
        
        toast.success(`Appointment with Dr. ${appointment.doctorName} has been cancelled`)
        return true
    }

    // Get user's appointments
    const getUserAppointments = () => {
        if (!isAuthenticated()) return []
        return appointments.filter(apt => apt.userId === user.id)
    }

    // Check if user has appointment with specific doctor on specific date/time
    const hasAppointmentConflict = (doctorId, date, time) => {
        if (!isAuthenticated()) return false
        return appointments.some(apt => 
            apt.userId === user.id && 
            apt.doctorId === doctorId && 
            apt.date === date && 
            apt.time === time &&
            apt.status === 'confirmed'
        )
    }

    // Get upcoming appointments
    const getUpcomingAppointments = () => {
        if (!isAuthenticated()) return []
        const today = new Date().toISOString().split('T')[0]
        return appointments
            .filter(apt => apt.userId === user.id && apt.date >= today && apt.status === 'confirmed')
            .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
    }

    const value = {
        doctors,
        user,
        token,
        isLoading,
        appointments: getUserAppointments(),
        register,
        login,
        logout,
        isAuthenticated,
        bookAppointment,
        cancelAppointment,
        getUserAppointments,
        hasAppointmentConflict,
        getUpcomingAppointments
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider