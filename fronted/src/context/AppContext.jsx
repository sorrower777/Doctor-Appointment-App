import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  
  // Function to validate token format
  const isValidToken = (token) => {
    if (!token || token === 'null' || token === 'undefined') return false;
    // Basic JWT format check - should have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  };

  // Get token from localStorage with validation
  const getValidToken = () => {
    const storedToken = localStorage.getItem("token");
    if (isValidToken(storedToken)) {
      return storedToken;
    } else {
      // Clear invalid token
      localStorage.removeItem("token");
      return null;
    }
  };

  const [token, setToken] = useState(getValidToken());
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [userData, setUserData] = useState(false)  

  // Load user data and appointments from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null' && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("user");
      }
    }

    // Load user's appointments
    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments && savedAppointments !== 'undefined' && savedAppointments !== 'null' && token) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (error) {
        console.error("Error parsing saved appointments:", error);
        localStorage.removeItem("appointments");
      }
    }
  }, [token]);

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Call real backend API
      const response = await axios.post(backendUrl + '/api/user/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });

      if (response.data.success) {
        const { token: userToken } = response.data;
        
        // Validate the received token
        if (isValidToken(userToken)) {
          // Create user info object (backend might not return user info on register)
          const userInfo = {
            name: userData.name,
            email: userData.email,
          };
          
          setUser(userInfo);
          setToken(userToken);

          // Save to localStorage
          localStorage.setItem("token", userToken);
          localStorage.setItem("user", JSON.stringify(userInfo));

          toast.success("Account created successfully!");
          setIsLoading(false);
          return true;
        } else {
          toast.error("Invalid token received from server");
          setIsLoading(false);
          return false;
        }
      } else {
        toast.error(response.data.message || "Registration failed");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
      setIsLoading(false);
      return false;
    }
  };

  // Login function
  const login = async (loginData) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", { email: loginData.email });
      // Call real backend API
      const response = await axios.post(backendUrl + '/api/user/login', {
        email: loginData.email,
        password: loginData.password
      });

      console.log("Login response:", response.data);

      if (response.data.success) {
        const { token: userToken, user: userInfo } = response.data;
        
        console.log("Received token:", userToken);
        console.log("Received user info:", userInfo);
        
        // Validate the received token
        if (isValidToken(userToken)) {
          setUser(userInfo);
          setToken(userToken);

          // Save to localStorage
          localStorage.setItem("token", userToken);
          localStorage.setItem("user", JSON.stringify(userInfo));

          console.log("Login successful, user set:", userInfo);
          toast.success("Login successful!");
          setIsLoading(false);
          return true;
        } else {
          console.error("Invalid token received:", userToken);
          toast.error("Invalid token received from server");
          setIsLoading(false);
          return false;
        }
      } else {
        console.error("Login failed:", response.data.message);
        toast.error(response.data.message || "Login failed");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setAppointments([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("appointments");
    toast.success("Logged out successfully!");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
  };

  // Book appointment function with payment
  const bookAppointment = (appointmentData, paymentData = null) => {
    if (!isAuthenticated()) {
      toast.error("Please login to book appointments");
      return false;
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
      status: paymentData ? "confirmed" : "pending_payment",
      bookedAt: new Date().toISOString(),
      address: appointmentData.address,
      payment: paymentData || null,
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    if (paymentData) {
      toast.success(
        `Appointment booked and paid successfully with Dr. ${appointmentData.doctorName}!`
      );
    } else {
      toast.success(
        `Appointment booked with Dr. ${appointmentData.doctorName}! Please complete payment.`
      );
    }
    return newAppointment;
  };

  // Process payment for existing appointment
  const processPayment = (appointmentId, paymentData) => {
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    if (appointmentIndex === -1) {
      toast.error("Appointment not found");
      return false;
    }

    const updatedAppointments = [...appointments];
    updatedAppointments[appointmentIndex] = {
      ...updatedAppointments[appointmentIndex],
      status: "confirmed",
      payment: paymentData,
      paidAt: new Date().toISOString()
    };

    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    toast.success("Payment completed successfully!");
    return true;
  };

  // Cancel appointment function
  const cancelAppointment = (appointmentId) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (!appointment) {
      toast.error("Appointment not found");
      return false;
    }

    const updatedAppointments = appointments.filter(
      (apt) => apt.id !== appointmentId
    );
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    toast.success(
      `Appointment with Dr. ${appointment.doctorName} has been cancelled`
    );
    return true;
  };

  // Get user's appointments
  const getUserAppointments = () => {
    if (!isAuthenticated()) return [];
    return appointments.filter((apt) => apt.userId === user.id);
  };

  // Check if user has appointment with specific doctor on specific date/time
  const hasAppointmentConflict = (doctorId, date, time) => {
    if (!isAuthenticated()) return false;
    return appointments.some(
      (apt) =>
        apt.userId === user.id &&
        apt.doctorId === doctorId &&
        apt.date === date &&
        apt.time === time &&
        apt.status === "confirmed"
    );
  };

  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    if (!isAuthenticated()) return [];
    const today = new Date().toISOString().split("T")[0];
    return appointments
      .filter(
        (apt) =>
          apt.userId === user.id &&
          apt.date >= today &&
          apt.status === "confirmed"
      )
      .sort(
        (a, b) =>
          new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
      );
  };

  // Remove past appointment function
  const removePastAppointment = (appointmentId) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (!appointment) {
      toast.error("Appointment not found");
      return false;
    }

    // Check if appointment is actually in the past
    const appointmentDateTime = new Date(appointment.date + " " + appointment.time);
    const now = new Date();
    
    if (appointmentDateTime >= now) {
      toast.error("You can only remove past appointments. Use cancel for future appointments.");
      return false;
    }

    if (!isAuthenticated() || appointment.userId !== user.id) {
      toast.error("Unauthorized to remove this appointment");
      return false;
    }

    const updatedAppointments = appointments.filter(
      (apt) => apt.id !== appointmentId
    );
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    toast.success(
      `Past appointment with Dr. ${appointment.doctorName} has been removed from your history`
    );
    return true;
  };
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const [doctors, setDoctors] = useState([]);

  const getDoctorsData = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) {
        setDoctors(data.doctors)
      }else{
        toast.error(data.message);
      }
    }
    catch (error) {
      console.log(error)
      toast.error("Failed to fetch doctors data");
    }
  }

  const loadUserProfileData = async () => {
    try {
      // Check if token exists and is not malformed
      if (!token || token === 'null' || token === 'undefined') {
        setUserData(false);
        return;
      }

      const {data} = await axios.get(backendUrl + '/api/user/get-profile', {headers:{token}})
      if(data.success) {
        setUserData(data.userData);
      }else {
        toast.error(data.message);
        // If token is invalid, clear it
        if (data.message && data.message.includes('jwt')) {
          localStorage.removeItem('token');
          setToken(null);
          setUserData(false);
        }
      }
    }catch(error) {
      console.log(error)
      // Check if it's a JWT error
      if (error.response?.data?.message?.includes('jwt') || error.message?.includes('jwt')) {
        console.log("JWT error detected, clearing token");
        localStorage.removeItem('token');
        setToken(null);
        setUserData(false);
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch user profile data");
      }
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      
      // Check if token exists and is not malformed
      if (!token || token === 'null' || token === 'undefined') {
        toast.error("Please login again");
        setIsLoading(false);
        return false;
      }

      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('phone', profileData.phone);
      formData.append('address', JSON.stringify(profileData.address));
      formData.append('dob', profileData.dob);
      formData.append('gender', profileData.gender);
      
      if (profileData.image) {
        formData.append('image', profileData.image);
      }

      const response = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: { 
          token,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        // Reload user profile data to get updated info
        await loadUserProfileData();
        setIsLoading(false);
        return true;
      } else {
        toast.error(response.data.message || "Failed to update profile");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      
      // Check if it's a JWT error
      if (error.response?.data?.message?.includes('jwt') || error.message?.includes('jwt')) {
        console.log("JWT error detected, clearing token");
        localStorage.removeItem('token');
        setToken(null);
        setUserData(false);
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to update profile");
      }
      return false;
    }
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
    getUpcomingAppointments,
    processPayment,
    removePastAppointment,
    userData,setUserData,
    loadUserProfileData,
    updateProfile,
    isValidToken
  };

  useEffect(() => {
    getDoctorsData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token){
      loadUserProfileData();
    }else{
      setUserData(false);
    }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
