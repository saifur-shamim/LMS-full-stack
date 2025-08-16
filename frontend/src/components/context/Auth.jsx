import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const userInfo = localStorage.getItem('userInfoLms'); 
    const [user, setUser] = useState(userInfo?JSON.parse(userInfo) : null);
 

    const login = (userInf) => {
        setUser(userInf); 
    }

    const logout = ()=> {
        localStorage.removeItem('userInfoLms');
        setUser(null); 
       
    }

    return <AuthContext.Provider value={{
        user,login,logout
    }}> 
        {children}
    </AuthContext.Provider>
}