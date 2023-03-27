import React, { useEffect } from "react"
import axios from 'axios'
import { TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import Content from "./Content"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
import NewContent from "./NewContent"
import { v4 as uuid } from 'uuid';

export default function EditArticle(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [article, setArticle] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [content, setContent] = React.useState([])
    const [newContent, setNewContent] = React.useState([])
    const [images, setImages] = React.useState([])

    const handleTitleChange = e => {
        setTitle(e.target.value)
    }

    const handleAuthorChange = e => {
        setAuthor(e.target.value) 
    }

    const handleLevelChange = (event) => {
        setLevel(event.target.value)
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
        console.log(final)
        let updatedArticle = {
            title: title,
            author: author,
            level: level,
            content: final
        }

        await axios.patch('http://localhost:5007/' + 'articles/' + article._id, updatedArticle,)
        .then(() => navigate('/articles'))
        .catch(err => console.log(err))

        images.forEach(async(img) => {
            const formData = new FormData()
            formData.append(article._id + img.name, img)

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
        })
    }

    const addText = () => {
        let temp = newContent
        let key = uuid()
        temp.push({
            index: key,
            contentType: 'text',
            text: '',
            header: '',
            new: true
        })
        setNewContent([...temp])
    }

    const deleteItem = (item) => {
        let temp

        if(item.new){
            temp = newContent.filter(content => content.index !== item.index)
        }
        else {
            temp = content.filter(content => content.index !== item.index)
        }

        if(item.contentType == 'image' && content.find(content => content.index == item.index)){
            axios.delete('http://localhost:5007/' + 'file/' + item.text)
            .then(res => console.log("File Deleted"))
        }

        if(item.new){
            setNewContent([...temp])  
        }
        else {
            setContent([...temp])  
        }
    }

    const addImage = e => {
        let img = e.target.files[0]

        
        let temp = newContent
        let key = uuid()
        temp.push({
            index: key,
            contentType: 'image',
            text: article._id + img.name,
            caption: '',
            file: img,
            new: true
        })

        let tempImages = images
        tempImages.push(img)

        setNewContent([...temp])
        setImages([...tempImages])
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
                </header>
                <main className='article-content'>
                {content.map(data => {
                    return <Content key={data.index} dbContent={data} deleteItem={deleteItem} itemKey={data.key}/>
                })}

                {newContent.map(data => {
                    return <NewContent key={data.index} current={data} deleteItem={deleteItem} itemKey={data.key}/>
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