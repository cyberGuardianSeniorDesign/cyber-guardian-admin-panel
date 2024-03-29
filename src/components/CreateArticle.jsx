import React, { useEffect } from "react"
import axios from 'axios'
import { TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import NewContent from "./NewContent"
import { v4 as uuid } from 'uuid';
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function CreateArticle(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [article, setArticle] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [images, setImages] = React.useState([])
    const [content, setContent] = React.useState([{index: 0, contentType: 'text', text: ''}])
    const [thumbnail, setThumbnail] = React.useState({})
    const [thumbnailName, setThumbnailName] = React.useState('Choose thumbnail file...')

    const handleTitleChange = e => {
        setTitle(e.target.value)
    }

    const handleAuthorChange = e => {
        setAuthor(e.target.value)
    }

    const handleLevelChange = (event) => {
        setLevel(event.target.value)
        console.log(event.target.value)
    }

    const addText = () => {
        let temp = content
        temp.push({
            index: content.length,
            contentType: 'text',
            text: ''
        })
        
        setContent([...temp])
    }

    const deleteItem = (index) => {
        let temp = content 
        let arrIdx = temp.findIndex(data =>  data.index == index)

        temp.splice(arrIdx, 1)
        setContent([...temp])
    }

    const addImage = (e) => {
        let img = e.target.files[0]

        let imgKey = uuid()

        let temp = content
        temp.push({
            index: content.length,
            contentType: 'image',
            text: imgKey + img.name,
            file: img,
            key: imgKey
        })

        let imgObj = {
            file: img,
            key: imgKey
        }

        let tempImages = images
        tempImages.push(imgObj)

        console.log(imgObj)
        setContent([...temp])
        setImages([...tempImages])
    }

    const addThumbnail = (e) => {
        setThumbnail(e.target.files[0])

        setThumbnailName(e.target.files[0].name)
    }

    const post = async() => {
        let temp = content
        temp.forEach(data => {
            if(data.contentType == 'image'){
                data = {
                    index: data.index,
                    contentType: data.contentType,
                    text: data.text
                }
            }
        })

        let postContent =  temp
        console.log(postContent)

        let thumbnailKey = uuid()
        let finalThumbnail = ''

        //upload thumbnail to google bucket
        if(thumbnailName !== 'Choose thumbnail file...'){
            finalThumbnail = thumbnailKey + thumbnail.name
            const formData = new FormData()
            formData.append(finalThumbnail, thumbnail)

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };

            await axios.post( process.env.REACT_APP_BACKEND + "file",formData,config)
                    .then((response) => {
                        console.log("The file is successfully uploaded");
                    }).catch((error) => {
                        console.log(error)
                    }); 
            
        }
        
        let article = {
            title: title,
            author: author,
            level: level,
            content: postContent,
            thumbnail: finalThumbnail
        }

        //upload images from article to Google bucket
        images.forEach(async(imgObj) => {
            const formData = new FormData()
            formData.append(imgObj.key + imgObj.file.name, imgObj.file)

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };

            await axios.post( process.env.REACT_APP_BACKEND + "file",formData,config)
                .then((response) => {
                    console.log("The file is successfully uploaded");
                }).catch((error) => {
                    console.log(error)
                }); 

        })

        
        //POST article object to backend
        await axios.post(process.env.REACT_APP_BACKEND + 'articles', article, 
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
                fetch(process.env.REACT_APP_BACKEND + "isAdminAuth", {
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
                    <span className="content-info-span">
                        <h1 className='content-title'>Title: </h1>
                        <TextField placeholder="Super Interesting Title" onChange={handleTitleChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '50%', minWidth: '200px'}}/>
                    </span>
                    <span className="content-info-span">
                        <h2 className="content-author">By:</h2>
                        <TextField placeholder="Author" onChange={handleAuthorChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '50%', minWidth: '200px'}}/>
                    </span>
                    <div className="header-row">
                        <div className="add-thumbnail-div">
                            <form onSubmit={addThumbnail}>
                                <label className="thumbnail-upload">
                                    <input type="file" id="add-image" name="img" accept="image/png, image/jpeg" onChange={e => addThumbnail(e)}></input>
                                    Browse for Thumbnail
                                </label>
                            </form> 
                            <p className="thumbnail-file">{thumbnailName}</p>
                        </div>
                        <FormControl sx={{alignContent: 'left', minWidth: 100}}>
                            <InputLabel id="demo-simple-select-label" sx={{color: '#e3e3e3' }}>Level</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={level}
                            onChange={handleLevelChange}
                            autoWidth
                            label="Level"
                            sx={{color: '#e3e3e3', '& .MuiInputBase-input':{border: '#e3e3e3'}}}
                            >
                                <MenuItem value={'Apprentice'}>Apprentice</MenuItem>
                                <MenuItem value={'Novice'}>Novice</MenuItem>
                                <MenuItem value={'Expert'}>Expert</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </header>
                <main className='article-content'>
                {content.map(data => {
                    return <NewContent key={data.index} current={data} deleteItem={deleteItem}/>
                })}
                <div className="button-div">
                    <button className='add-txt-btn' onClick={addText}>Add Text Section</button>
                     <form onSubmit={addImage}>
                        <label className="image-upload">
                            <input type="file" id="add-image" name="img" accept="image/png, image/jpeg" onChange={e => addImage(e)}></input>
                            Add Image
                        </label>
                    </form> 
                    <button className='post-btn' onClick={post}>POST</button>
                </div>
                </main>
            </div>
            :<h1>Loading...</h1>}
        </div>
}