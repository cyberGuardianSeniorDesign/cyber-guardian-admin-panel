import React, { useEffect } from "react"
import axios from 'axios'
import { TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import NewContent from "./NewContent"

import { EditorState } from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


window.Buffer = window.Buffer || require("buffer").Buffer;

export default function Test(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [article, setArticle] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [images, setImages] = React.useState([])
    const [content, setContent] = React.useState([{index: 0, contentType: 'text', text: ''}])
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty())
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

    const handleEditorStateChange = (editorState) => {
        setEditorState(editorState)
    }

    const addText = () => {
        let temp = content
        temp.push({
            index: content.length,
            contentType: 'text',
            text: ''
        })
        
        console.log("Add")
        console.log(temp)
        setContent([...temp])
    }

    const deleteItem = (index) => {
        let temp = content 
        let arrIdx = temp.findIndex(data =>  data.index == index)

        temp.splice(arrIdx, 1)
        console.log("Delete")
        setContent([...temp])
        adjustIndexes(index, temp)
    }

    const adjustIndexes = (index, temp) => {
        if(index != content.length-2){
            for(let i = index; i < temp.length; i++){
                temp[i].index = i
            }
        }
        console.log(temp)
        setContent([...temp])
    }

    const addImage = async(e) => {
        let img = e.target.files[0]

        
        let temp = content
        temp.push({
            index: content.length,
            contentType: 'image',
            text: article._id + img.name,
            file: img
        })

        let tempImages = images
        tempImages.push(img)

        console.log(temp)
        setContent(temp)
        setImages(tempImages)
        forceUpdate()
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

        let article = {
            title: title,
            author: author,
            level: level,
            content: postContent
        }

        images.forEach(async(img) => {
            const formData = new FormData()
            formData.append(article._id + img.file.name, img.file)

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
                .then(data => data.isLoggedIn ? navigate('/test/create'):navigate('/login'))
        }

        verifyToken()
        setLoading(false)
    }, [])


    return<div>
            {!loading ?
            <div> 
            <Editor
            wrapperClassName="rich-editor demo-wrapper"
            editorClassName="text-editor"
            editorState={editorState}
            onEditorStateChange={handleEditorStateChange}
            placeholder="Type paragraph..." 
            />
                <header className="content-header">
                    <span className="content-info-span">
                        <h1 className='content-title'>Title: </h1>
                        <TextField placeholder="Super Interesting Title" onChange={handleTitleChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
                    </span>
                    <span className="content-info-span">
                        <h2 className="content-author">By:</h2>
                        <TextField placeholder="Author" onChange={handleAuthorChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
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
                {console.log()}
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