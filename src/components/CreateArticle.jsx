import React, { useEffect } from "react"
import axios from 'axios'
import { TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import Content from "./Content"
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function CreateArticle(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [article, setArticle] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [content, setContent] = React.useState([{index: 0, contentType: 'text', text: ''}])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleTitleChange = e => {
        setTitle(e.target.value)
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
                fetch("http://localhost:5007/isAdminAuth", {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
                })
                .then(res => res.json())
                .then(data => data.isLoggedIn ? navigate('/articles/create'):navigate('/login'))
        }

        verifyToken()
        setLoading(false)
    }, [])


    return<div>
            {!loading ?
            <div> 
                <header className="content-header">
                    <h1 className='content-title'>Title: </h1>
                    <TextField placeholder="Super Interesting Title" onChange={handleTitleChange}/>
                </header>
                <main className='article-content'>
                {content.map(data => {
                    console.log("Render content")
                    return <Content key={data.index} dbContent={data} deleteItem={deleteItem}/>
                })}
                </main>
                <button onClick={addText}>Add Text</button>
                <form onSubmit={addImage}>
                    <input type="file" id="add-image" name="img" accept="image/png, image/jpeg" onChange={e => addImage(e)}></input>
                </form>
                <button>POST</button>
            </div>
            :<h1>Loading...</h1>}
        </div>
}