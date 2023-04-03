import React, { useEffect } from "react"
import axios from 'axios'
import { TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import Content from "./Content"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'

export default function EditArticle(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [article, setArticle] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [content, setContent] = React.useState([])
    const [thumbnail, setThumbnail] = React.useState({})
    const [ogThumbnail, setOgThumbnail] = React.useState('')
    const [thumbnailName, setThumbnailName] = React.useState('Choose thumbnail file...')
    const [newContent, setNewContent] = React.useState([])
    const [images, setImages] = React.useState([])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

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

    const patch = async() => {
        let tempNew = newContent

        tempNew.forEach(content => {
            if(content.contentType === 'text'){
                delete content.new
            } else {
                delete content.new
                delete content.file
            }
        })

        let tempCurrent = content
        let final = tempCurrent.concat(tempNew)
        
        let thumbnailKey = uuid()
        let finalThumbnail = ''

        //upload thumbnail to google bucket
        if(thumbnailName !== 'Choose thumbnail file...' && ogThumbnail != thumbnailName){
            finalThumbnail = thumbnailKey + thumbnail.name
            const formData = new FormData()
            formData.append(finalThumbnail, thumbnail)

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            
            await axios.post("http://localhost:5007/file",formData,config)
                    .then((response) => {
                        console.log("The file is successfully uploaded");
                    }).catch((error) => {
                        console.log(error)
                    }); 
            
        } else if(thumbnailName !== 'Choose thumbnail file...'){
            finalThumbnail = ogThumbnail
        }

        let updatedArticle = {
            title: title,
            author: author,
            level: level,
            content: final,
            thumbnail: finalThumbnail
        }
        console.log(article._id)
        await axios.patch('http://localhost:5007/' + 'articles/' + article._id, updatedArticle,)
        .then(() => navigate('/articles'))
        .catch(err => console.log(err))

        images.forEach(img => {
            const formData = new FormData()
            formData.append(article._id + img.name, img)

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };

            axios.post("http://localhost:5007/file",formData,config)
                .then((response) => {
                    console.log("The file is successfully uploaded");
                }).catch((error) => {
                    console.log(error)
                           }); 
        })
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
        if(temp[index].contentType == 'image'){
            axios.delete('http://localhost:5007/' + 'file/' + temp[index].text)
            .then(res => console.log("File Deleted"))
        }
        temp.splice(index, 1)
        setContent(temp)
        forceUpdate()
    }

    const addImage = async(e) => {
        let img = e.target.files[0]

        const formData = new FormData()
        formData.append(article._id + img.name, img)

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.post("http://localhost:5007/file",formData,config)
            .then((response) => {
                console.log("The file is successfully uploaded");
            }).catch((error) => {
                console.log(error)
            }); 
        
        let temp = content
        temp.push({
            index: content.length,
            contentType: 'image',
            text: article._id + img.name
        })

        let tempImages = images
        tempImages.push(img)

        setContent(temp)
        setImages(tempImages)
        forceUpdate()
    }

    const addThumbnail = (e) => {
        setThumbnail(e.target.files[0])

        setThumbnailName(e.target.files[0].name)
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
                setLevel(state.article.level)
                //only et thumbnailName if article has thumbnail currently
                if(state.article.thumbnail !== ''){
                    setOgThumbnail(state.article.thumbnail)
                    setThumbnailName(state.article.thumbnail)
                }
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
                {console.log(content)}
                <header className="content-header">
                    <span className="content-info-span">
                        <h1 className='content-title'>Title: </h1>
                        <TextField defaultValue={article.title} onChange={handleTitleChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '50%', minWidth: '200px'}}/>
                    </span>
                    <span className="content-info-span">
                        <h2 className="content-author">By:</h2>
                        <TextField defaultValue={article.author} onChange={handleAuthorChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '50%', minWidth: '200px'}}/>
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
                        <FormControl sx={{ m: 1, minWidth: 100}}>
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
                    
                    return <Content key={data.index} dbContent={data} deleteItem={deleteItem}/>
                })}
                <div className="button-div">
                    <button className='post-btn' onClick={addText}>Add Text</button>
                    <form onSubmit={addImage}>
                        <label className="image-upload">
                            <input type="file" id="add-image" name="img" accept="image/png, image/jpeg" onChange={e => addImage(e)}></input>
                            Add Image
                        </label>
                    </form>
                    <button className='post-btn' onClick={patch}>Update</button>
                </div>
                </main>
            </div>
            :<h1>Loading...</h1>}
        </div>
}