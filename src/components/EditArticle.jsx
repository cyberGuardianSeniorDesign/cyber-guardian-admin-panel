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
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleTitleChange = e => {
        setTitle(e.target.value)
    }

    const handleAuthorChange = e => {
        setAuthor(e.target.value)
    }

    const patch = async() => {
        let updatedArticle = {
            title: title,
            author: author,
            content: content
        }
        console.log(article._id)
        await axios.patch('http://localhost:5007/' + 'articles/' + article._id, updatedArticle,)
        .then(() => navigate('/articles'))
        .catch(err => console.log(err))
    }

    const addText = () => {
        let temp = content
        temp.push({
            index: content.length,
            contentType: 'text',
            text: ''
        })
        setContent(temp)
        forceUpdate()
    }

    const deleteItem = (index) => {
        let temp = content 
        temp.splice(index, 1)
        setContent(temp)
        forceUpdate()
    }

    const addImage = async(e) => {
        let temp = content
        let imgBuffer = await e.target.files[0].arrayBuffer()
        temp.push({
            index: content.length,
            contentType: 'image',
            buffer: imgBuffer
        })
        setContent(temp)
        forceUpdate()
    }

    React.useEffect(() => {
        const verifyToken = async() => {
                fetch(process.env.BACKEND + "isAdminAuth", {
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
                setContent(state.article.content)
                setTitle(state.article.title)
                setAuthor(state.article.author)
                window.localStorage.setItem('state', JSON.stringify(state.article))
            } else {
                const data = window.localStorage.getItem('state')
                if(data != undefined || null)
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
                    <span className="content-info-span">
                        <h1 className='content-title'>Title: </h1>
                        <TextField defaultValue={article.title} onChange={handleTitleChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
                    </span>
                    <span className="content-info-span">
                        <h2 className="content-author">By:</h2>
                        <TextField defaultValue={article.author} onChange={handleAuthorChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
                    </span>
                </header>
                <main className='article-content'>
                {content.map(data => {
                    
                    return <Content key={data.index} dbContent={data} deleteItem={deleteItem}/>
                })}
                <button onClick={addText}>Add Text</button>
                <form onSubmit={addImage}>
                    <input type="file" id="add-image" name="img" accept="image/png, image/jpeg" onChange={e => addImage(e)}></input>
                </form>
                <button className='post-button' onClick={patch}>Update</button>
                </main>
            </div>
            :<h1>Loading...</h1>}
        </div>
}