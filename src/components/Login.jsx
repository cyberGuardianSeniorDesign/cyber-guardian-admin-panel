import React from 'react'
import { useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = React.useState()
  const [password, setPassword] = React.useState()
  const [token, setToken] = React.useState(false)
  const [openFail, setOpenFail] = React.useState(false)
  const [failMsg, setFailMsg] = React.useState('')
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const handleLogin = e => {
    e.preventDefault()
    
    const admin = {
      email: email,
      password: password
    }

    fetch('http://localhost:5007/login', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(admin)
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("token", data.token)
      setToken(data.token)
      navigate('/')
      forceUpdate()
    })
    .catch(err => {
      setFailMsg('Incorrect Username or Password')
      setOpenFail(true)
    })
  }

  const handleCloseFail = () => {
    setOpenFail(false);
  }

  useEffect(() => {
    const verifyToken = async() => {
      fetch("http://localhost:5007/isAdminAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      })
      .then(res => res.json())
      .then(data => data.isLoggedIn ? navigate('/'):null)
    }

    verifyToken()
  }, [])
    
  
  return(
    <div className='login-page'>
      <div className="login-wrapper">
        <h1 className='login-h1'>Cyber Guardian Admin Login</h1>
        <form className='login-form' onSubmit={handleLogin}>
          <input className='login-input' placeholder='Email...' type="text" onChange={e => {setEmail(e.target.value)}}/>
          <input className='login-input' placeholder='Password...' type="password" onChange={e => {setPassword(e.target.value)}}/>
          <div>
            <button className='login-button' type="submit" onSubmit={e => handleLogin(e)}>Login</button>
          </div>
        </form>
      </div>
    <Snackbar open={openFail} autoHideDuration={3000} onClose={handleCloseFail}>
      <Alert onClose={handleCloseFail} severity="error" sx={{ width: '100%' }}>
        {failMsg}
      </Alert>
    </Snackbar>
    </div>
  )
}

