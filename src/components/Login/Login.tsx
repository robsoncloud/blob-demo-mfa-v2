import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { loginRequest } from '../../authConfig'

const Login = () => {
  const location = useLocation()
  const IsAuthenticated = useIsAuthenticated()
  const {instance} = useMsal()
  const [redirect, setRedirect] = useState("");

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).then(() => console.log("success"))
  }

  useEffect(() => {

    if(IsAuthenticated)
        return
    const redirectTo = location.pathname + location.search;
    sessionStorage.setItem("redirectAfterLogin", redirectTo)
    setRedirect( redirectTo)
  },[IsAuthenticated, location])
  return (
    <div className='bg-red-200 px-5 py-2 rounded-md shadow flex mx-auto'>
        <button onClick={handleLoginRedirect}>You need to login to have access to this site. Redirect: {redirect} </button>
    </div>
  )
}

export default Login