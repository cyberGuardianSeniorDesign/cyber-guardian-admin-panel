import React from 'react'
import { useNavigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect } from 'react';

async function loginUser(credentials) {
  return fetch('http://localhost:5007/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = React.useState()
  const [password, setPassword] = React.useState()
  const [token, setToken] = React.useState(false)

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
    })
  }

  useEffect(() => {
    console.log(localStorage.getItem("token"))
    const verifyToken = async() => {
      fetch("http://localhost:5007/isAdminAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      })
      .then(res => res.json())
      .then(data => data.isLoggedIn ? navigate('/'):null)

      console.log("Token verified")
    }

    verifyToken()
  }, [])
    
  
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleLogin}>
        <label>
          <p>Email</p>
          <input type="text" onChange={e => {setEmail(e.target.value)}}/>
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => {setPassword(e.target.value)}}/>
        </label>
        <div>
          <button type="submit" onSubmit={e => handleLogin(e)}>Submit</button>
        </div>
      </form>
    </div>
  )
}

