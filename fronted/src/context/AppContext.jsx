import React, { createContext } from 'react'
import { doctors } from '../assets/assets/assets_frontend/assets'

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext()
const AppContextProvider = (props) =>{

   const value = {
       doctors
   }

   return (
       <AppContext.Provider value={value}>
           {props.children}
       </AppContext.Provider>
   )
}
export default AppContextProvider