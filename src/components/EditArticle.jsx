import React, { useEffect } from "react"
import axios from 'axios'
import { TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import Content from "./Content"


export default function EditArticle(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [article, setArticle] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [content, setContent] = React.useState([])

    const handleTitleChange = e => {
        setTitle(e.target.value)
    }
    React.useEffect(() => {
        const verifyToken = async() => {
                fetch("http://localhost:5007/isAdminAuth", {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
                })
                .then(res => res.json())
                .then(data => data.isLoggedIn ? navigate('/articles/edit/' + article._id):navigate('/login'))
        }

        const loadArticle = () => {
            if(state != undefined || null){
                setArticle(state.article)
                window.localStorage.setItem('state', JSON.stringify(state.article))
            } else {
                const data = window.localStorage.getItem('state')
                if(data != null)
                {
                    //verifyToken(data._id)
                    setArticle(JSON.parse(data))
                    verifyToken()
                } 
            }
        }

        loadArticle()
        setLoading(false)
    }, [])

    React.useEffect(() => {
        window.localStorage.setItem('state', JSON.stringify(article))
    }, [article])

    return<div>
            {!loading ?
            <div> 
                <header className="content-header">
                    <h1 className='content-title'>Title: </h1>
                    <TextField defaultValue={article.title} onChange={handleTitleChange}/>
                </header>
                <main className='article-content'>
                {article.content.map(data => {
                    
                    return <Content key={data.index} dbContent={data}/>
                })}
                {console.log("Render content")}
                </main>
            </div>
            :<h1>Loading...</h1>}
        </div>
}