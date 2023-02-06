import React, { useEffect } from "react"
import axios from 'axios'
import { TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import Content from "./Content"


export default function CreateChecklist(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [checklist, setChecklist] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [listItems, setListItems] = React.useState([{index: 0, contentType: 'text', text: ''}])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleTitleChange = e => {
        setTitle(e.target.value)
    }

    const handleAuthorChange = e => {
        setAuthor(e.target.value)
    }

    const addListItem = () => {
        let temp = listItems
        temp.push({
            index: listItems.length,
            contentType: 'text',
            text: ''
        })
        setListItems(temp)
        forceUpdate()
    }

    const deleteItem = (index) => {
        let temp = listItems 
        temp.splice(index, 1)
        setListItems(temp)
        forceUpdate()
    }

    const addImage = async(e) => {
        let temp = listItems
        temp.push({
            index: listItems.length,
            contentType: 'image',
            fileName: e.target.files[0].fileName
        })
        setListItems(temp)
        forceUpdate()
    }

    const post = async() => {
        let article = {
            title: title,
            author: author,
            content: listItems
        }

        console.log(article)

        await axios.post('http://localhost:5007/' + 'articles', article, 
        {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(() => navigate('/articles'))
        .catch(err => console.log(err))
    }

    React.useEffect(() => {
        const verifyToken = async() => {
                fetch("http://localhost:5007/isAdminAuth", {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
                })
                .then(res => res.json())
                .then(data => data.isLoggedIn ? navigate('/checklists/create'):navigate('/login'))
        }

        verifyToken()
        setLoading(false)
    }, [])


    return<div>
            {!loading ?
            <div> 
                <header className="content-header">
                    <span className="content-info-span">
                        <h1 className='content-title'>Title: </h1>
                        <TextField placeholder="Super Interesting Title" onChange={handleTitleChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
                    </span>
                    <span className="content-info-span">
                        <h2 className="content-author">By:</h2>
                        <TextField placeholder="Author" onChange={handleAuthorChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
                    </span>
                </header>
                <main className='checklist-content'>
                {listItems.map(data => {
                    return <div>
                        
                    </div>
                })}
                <div className="button-div">
                    <button className='add-txt-btn' onClick={addListItem}>Add List Item</button>
                    {/* <form onSubmit={addImage}>
                        <label className="image-upload">
                            <input type="file" id="add-image" name="img" accept="image/png, image/jpeg" onChange={e => addImage(e)}></input>
                            Add Image
                        </label>
                    </form> */}
                    <button className='post-btn' onClick={post}>POST</button>
                </div>
                </main>
            </div>
            :<h1>Loading...</h1>}
        </div>
}