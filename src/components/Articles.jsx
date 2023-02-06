import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Typography } from "@mui/material"
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Tooltip from '@mui/material/Tooltip'

export default function Articles(){
    const navigate = useNavigate()
    const [articles, setArticles] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    let even  = true;

    const handleEditArticle = (article) => {
        navigate('edit/' + article._id, {state: {article: article}})
    }

    const handleViewArticle = (article) => {
        navigate('view/' + article._id, {state: {article: article}})
    }

    const handleCreateArticle = () => {
        navigate('create')
    }

    const deleteArticle = async(id) => {
        console.log('http://localhost:5007/' + 'articles/' + id)
        await axios.delete('http://localhost:5007/' + 'articles/' + id)
        .then(() => console.log("Article Deleted"))
        
        let temp = articles

        for(let i = 0; i < temp.length; i++){
            if(temp[i]._id == id){
                temp.splice(i, 1)
            }
        }

        setArticles(temp)
        forceUpdate()
    }

    React.useEffect(() => {
        const verifyToken = async() => {
            fetch('http://localhost:5007/' + "isAdminAuth", {
              headers: {
                "x-access-token": localStorage.getItem("token")
              }
            })
            .then(res => res.json())
            .then(data => data.isLoggedIn ? navigate('/articles'):navigate('/login'))
        }

        const fetchArticles = async() => {
            await fetch('http://localhost:5007/' + 'articles')
            .then(res => res.json())
            .then(articles => setArticles(articles))
        }

        verifyToken()
        fetchArticles()
        setLoading(false)
    }, [])

    return(<main >
        {!loading ? 
        <div className='articles-page'>
            <h1 className="home-h1">ARTICLES</h1>
            <button className='create-btn' onClick={handleCreateArticle}>Create New Article</button>
            <div className="articles-div">
                {articles.map(article => {

                    if(even){
                        even = !even
                        return <div key={article._id} className='article-card'>
                            <Typography sx={{width: '30%', marginTop: '5px'}}>{article.title}</Typography>
                            <Typography sx={{width: '30%', marginTop: '5px'}}>{article.author}</Typography>
                            <div className="content-options">
                                <Tooltip title='View'>
                                    <IconButton>
                                        <VisibilityIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Edit'>
                                    <IconButton onClick={e=>handleEditArticle(article)}>
                                        <EditIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Delete'>
                                    <IconButton onClick={() => deleteArticle(article._id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    } else {
                        even = !even
                        return <div key={article._id} className='article-card-even'>
                            <Typography sx={{width: '30%', marginTop: '5px'}}>{article.title}</Typography>
                            <Typography sx={{width: '30%', marginTop: '5px'}}>{article.author}</Typography>
                            <div className="content-options">
                                <Tooltip title='View'>
                                    <IconButton>
                                        <VisibilityIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Edit'>
                                    <IconButton onClick={e=>handleEditArticle(article)}>
                                        <EditIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Delete'>
                                    <IconButton onClick={() => deleteArticle(article._id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    }
                })}
            </div>
        </div>:<span>Loading...</span>}
    </main>)
}