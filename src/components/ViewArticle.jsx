import React, { useEffect } from "react"
import axios from 'axios'
import { Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"


export default function ViewArticle({dbArticle})
{
    const navigate = useNavigate()
    const [article, setArticle] = React.useState(dbArticle)

    React.useEffect(() => {
        const verifyToken = async() => {
            fetch(process.env.BACKEND + "isAdminAuth", {
              headers: {
                "x-access-token": localStorage.getItem("token")
              }
            })
            .then(res => res.json())
            .then(data => data.isLoggedIn ? navigate('/articles/' + article._id):navigate('/login'))
        }

        verifyToken()
    }, [])

    return<div>
        
    </div>
}