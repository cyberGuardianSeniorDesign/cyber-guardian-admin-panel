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
import Content from "./Content";
import NewContent from "./NewContent";
export default function EditChecklist(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [checklist, setChecklist] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [desc, setDesc] = React.useState('')
    const [listItems, setListItems] = React.useState([{index: 0, contentType: 'text', text: ''}])
    const [newItems, setNewItems] = React.useState([])
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

    const handleDescriptionChange = (event) => {
        setDesc(event.target.value)
    }
    
    const handleListItemChange = (event, data) => {
        let temp = listItems

        let itemIdx = temp.indexOf(data)

        temp[itemIdx].text = event.target.value

        setListItems(temp)
    }

    const handleNewItemChange = (event, data) => {
        let temp = newItems

        let itemIdx = temp.indexOf(data)

        temp[itemIdx].text = event.target.value

        setNewItems(temp)
    }

    const addListItem = () => {
        let temp = newItems
        let key = uuid()
        temp.push({
            index: key,
            contentType: 'text',
            text: '',
            new: true
        })

        setNewItems([...temp])
        forceUpdate()
    }

    const deleteItem = (item) => {
        let temp

        if(item.new){
            temp = newItems.filter(content => content.index !== item.index)
        }
        else {
            temp = listItems.filter(content => content.index !== item.index)
        }

        if(item.contentType == 'image' && listItems.find(content => content.index == item.index)){
            axios.delete('http://localhost:5007/' + 'file/' + item.text)
            .then(res => console.log("File Deleted"))
        } else if(item.contentType == 'image') {
            let tempImg = images.filter(imgObj => imgObj.key != temp.key)
            setImages([...tempImg])
        }

        if(item.new){
            setNewItems([...temp])  
        }
        else {
            setListItems([...temp])  
        }
    }

    const addImage = async(e) => {
        let img = e.target.files[0]

        let temp = newItems
        let key = uuid()
        let imgKey = uuid()
        temp.push({
            index: key,
            contentType: 'image',
            text: imgKey + img.name,
            caption: '',
            file: img,
            key: imgKey,
            new: true
        })

        let imgObj = {
            file: img,
            key: imgKey
        }

        let tempImages = images
        tempImages.push(imgObj)

        setNewItems([...temp])
        setImages([...tempImages])
    }

    const patch = async() => {
        let tempNew = newItems

        tempNew.forEach(content => {
            if(content.contentType === 'text'){
                delete content.new
            } else {
                delete content.new
                delete content.file
                delete content.key
            }
        })

        let tempCurrent = listItems
        let final = tempCurrent.concat(tempNew)

        let updatedChecklist = {
            title: title,
            level: level,
            author: author,
            content: final
        }

        images.forEach(async(imgObj) => {
            const formData = new FormData()
            formData.append(imgObj.key + imgObj.file.name, imgObj.file)

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

        console.log(updatedChecklist)
        await axios.patch('http://localhost:5007/' + 'checklists/' + checklist._id, updatedChecklist,)
        .then(() => navigate('/checklists'))
        .catch(err => console.log(err))
    }


    React.useEffect(() => {
        const verifyToken = async() => {
                fetch(process.env.BACKEND + "isAdminAuth", {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
                })
                .then(res => res.json())
                .then(data => data.isLoggedIn ? navigate('/checklists/edit/' + checklist._id):navigate('/login'))
        }

        const loadChecklist = () => {
            if(state != undefined || null){
                setChecklist(state.checklist)
                setListItems(state.checklist.content)
                setTitle(state.checklist.title)
                setAuthor(state.checklist.author)
                setLevel(state.checklist.level)
                window.localStorage.setItem('state', JSON.stringify(state.checklist))
            } else {
                const data = window.localStorage.getItem('state')
                if(data != undefined || null)
                {
                    //verifyToken(data._id)
                    setChecklist(JSON.parse(data))

                    verifyToken()
                } 
            }
        }

        loadChecklist()
        setLoading(false)
    }, [])

    React.useEffect(() => {
        window.localStorage.setItem('state', JSON.stringify(checklist))
    }, [checklist])

    return<div>
            {!loading ?
            <div> 
                <header className="content-header">
                    <span className="content-info-span">
                        <h1 className='content-title'>Title: </h1>
                        <TextField placeholder="Super Interesting Title" defaultValue={checklist.title} onChange={handleTitleChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
                    </span>
                    <span className="content-info-span">
                        <h2 className="content-author">By:</h2>
                        <TextField placeholder="Author" defaultValue={checklist.author} onChange={handleAuthorChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
                    </span>
                    <form onSubmit={addImage}>
                        <label className="image-upload">
                            <input type="file" id="add-image" name="img" accept="image/png, image/jpeg" onChange={e => addImage(e)}></input>
                            Add Image
                        </label>
                    </form>
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
                    <span className="content-info-span">
                        <h2 className='content-title'>Description: </h2>
                        <TextField defaultValue={checklist.description} placeholder="Checklist description..." onChange={handleDescriptionChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '65%'}}/>
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
                        <Content key={data.index} dbContent={data} deleteItem={deleteItem} itemKey={data.key}/>
                        </div>
                    }
                })}

                {newItems.map(data => {
                    if(data.contentType == 'text'){
                        return <div key={data.index} className='checklist-item-div'>
                            <IconButton onClick={() => deleteItem(data)}>
                                <DeleteIcon sx={{color: 'white'}}/>
                            </IconButton>
                            <TextField defaultValue={data.text} onChange={e => handleNewItemChange(e, data)} sx={{backgroundColor: '#e3e3e3', borderRadius: '5px', height: '100%', width: '80%'}}/>
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
                    <button className='post-btn' onClick={patch}>Update</button>
                </div>
                </main>
            </div>
            :<h1>Loading...</h1>}
        </div>
}