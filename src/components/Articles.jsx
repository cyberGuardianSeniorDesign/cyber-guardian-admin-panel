import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Typography } from "@mui/material"
export default function Articles(){
    const navigate = useNavigate()
    const [articles, setArticles] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    const handleEditArticle = (article) => {
        navigate('edit/' + article._id, {state: {article: article}})
    }

    const handleViewArticle = (article) => {
        navigate('view/' + article._id, {state: {article: article}})
    }

    const handleCreateArticle = () => {
        navigate('create')
    }

    React.useEffect(() => {
        const verifyToken = async() => {
            fetch("http://localhost:5007/isAdminAuth", {
              headers: {
                "x-access-token": localStorage.getItem("token")
              }
            })
            .then(res => res.json())
            .then(data => data.isLoggedIn ? navigate('/articles'):navigate('/login'))
        }

        const fetchArticles = async() => {
            await fetch('http://localhost:5007/articles')
            .then(res => res.json())
            .then(articles => setArticles(articles))
        }

        verifyToken()
        fetchArticles()
        setLoading(false)
    }, [])

    return(<main className='Articles'>
        {!loading ? 
        <div>
            <h1>Articles</h1>
            <button onClick={handleCreateArticle}>Create New Article</button>
            {articles.map(article => {
                return <div key={article._id} className='article-card'>
                    <Typography>{article.title}</Typography>
                    <Typography>{article.author}</Typography>
                    <button>View</button>
                    <button onClick={e=>handleEditArticle(article)}>Edit</button>
                    <button>Delete</button>
                </div>
            })}
        </div>:<span>Loading...</span>}
    </main>)
}