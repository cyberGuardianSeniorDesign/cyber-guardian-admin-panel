import React, { useEffect } from "react"
import axios from 'axios'
import { TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Tooltip from '@mui/material/Tooltip'
import { v4 as uuid } from 'uuid';
import NewContent from "./NewContent";
 
export default function CreateChecklist(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [checklist, setChecklist] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [desc, setDesc] = React.useState('')
    const [listItems, setListItems] = React.useState([{index: 0, contentType: 'text', text: ''}])
    const [images, setImages] = React.useState([])
    const [thumbnail, setThumbnail] = React.useState({})
    const [thumbnailName, setThumbnailName] = React.useState('Choose thumbnail file...')
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

    const handleDescriptionChange = (event) => {
        setDesc(event.target.value)
    }

    const handleListItemChange = (event, id) => {
        let temp = listItems

        temp[id].text = event.target.value

        setListItems(temp)
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

    const deleteItem = (item) => {
        let temp = listItems 
        
        temp = temp.filter(listItem => listItem.index !== item.index)
        if(item.contentType == 'image') {
            let tempImg = images.filter(imgObj => imgObj.key != temp.key)
            setImages([...tempImg])
        }
        
        setListItems([...temp])
    }

    const addImage = async(e) => {
        let img = e.target.files[0]

        
        let temp = listItems
        let key = uuid()
        let imgKey = uuid()
        temp.push({
            index: key,
            contentType: 'image',
            text: imgKey + img.name,
            caption: '',
            file: img,
            new: true
        })

        let imgObj = {
            file: img,
            key: imgKey
        }

        let tempImages = images
        tempImages.push(imgObj)

        setListItems([...temp])
        setImages([...tempImages])
    }

    const addThumbnail = (e) => {
        setThumbnail(e.target.files[0])

        setThumbnailName(e.target.files[0].name)
    }

    const post = async() => {
        let temp = listItems
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

            await axios.post(process.env.REACT_APP_BACKEND + "file",formData,config)
                    .then((response) => {
                        console.log("The file is successfully uploaded");
                    }).catch((error) => {
                        console.log(error)
                    }); 
            
        }
        
        let checklist = {
            title: title,
            author: author,
            level: level,
            description: desc,
            content: postContent,
            thumbnail: finalThumbnail
        }

        console.log(checklist)

        images.forEach(async(imgObj) => {
            const formData = new FormData()
            formData.append(imgObj.key + imgObj.file.name, imgObj.file)

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };

            await axios.post(process.env.REACT_APP_BACKEND + "file",formData,config)
                .then((response) => {
                    console.log("The file is successfully uploaded");
                }).catch((error) => {
                    console.log(error)
                }); 

        })


        await axios.post(process.env.REACT_APP_BACKEND + 'checklists', checklist, 
        {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(() => navigate('/checklists'))
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
                        <TextField placeholder="Super Interesting Title" onChange={handleTitleChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '50%', minWidth: '200px'}}/>
                    </span>
                    <span className="content-info-span">
                        <h1 className="content-author">By:</h1>
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
                        <FormControl sx={{ m: "2em 0", minWidth: 100}}>
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
                    <span className="content-info-span">
                        <h2 className='content-title'>Description: </h2>
                        <TextField placeholder="Checklist description..." onChange={handleDescriptionChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '65%'}}/>
                    </span>
                </header>
                <main className='checklist-content'>
                {listItems.map(data => {
                    if(data.contentType == 'text'){
                        return <div key={data.index} className='checklist-item-div'>
                            <IconButton onClick={() => deleteItem(data)}>
                                <DeleteIcon sx={{color: 'white'}}/>
                            </IconButton>
                            <TextField defaultValue={data.text} placeholder="Checklist Item" onChange={e => handleListItemChange(e, data)} sx={{backgroundColor: '#e3e3e3', borderRadius: '5px', height: '100%', width: '80%'}}/>
                        </div>
                    } else {
                        return <div key={data.index} className='checklist-item-div'>
                        <NewContent key={data.index} current={data} deleteItem={deleteItem} itemKey={data.key}/>
                        </div>
                    }
                })}
                <div className="button-div">
                    <button className='add-txt-btn' onClick={addListItem}>Add List Item</button>
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