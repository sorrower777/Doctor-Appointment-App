import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext.jsx'

const Dashboard = () => {
  const {aToken, getDashData, cancelAppointment, dashData} = useContext(AdminContext)
  useEffect(() => {
    if(aToken) {
      getDashData()
    }
  }, [aToken])
  return (
    <div>

    </div>
  )
}

export default Dashboard