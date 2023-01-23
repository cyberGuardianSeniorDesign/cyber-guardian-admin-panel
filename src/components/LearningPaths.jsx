import React, { useEffect } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export default function LearningPaths({learningPaths}){
    const navigate = useNavigate()
    const [path, setPaths] = React.useState(learningPaths)
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        const verifyToken = async() => {
            fetch(process.env.BACKEND + "isAdminAuth", {
              headers: {
                "x-access-token": localStorage.getItem("token")
              }
            })
            .then(res => res.json())
            .then(data => data.isLoggedIn ? navigate('/articles'):navigate('/login'))
          }

          verifyToken()
    }, [])
    return(<main className='LearningPaths'>
        {!loading ? <div>Loaded</div>:<span>Loading...</span>}
    </main>)
}