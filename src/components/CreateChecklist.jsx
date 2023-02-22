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

export default function CreateChecklist(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [checklist, setChecklist] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [listItems, setListItems] = React.useState([{index: 0, contentType: 'text', text: ''}])
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

    const deleteItem = (index) => {
        let temp = listItems 
        temp.splice(index, 1)
        for(let i = index; i < temp.length; i++){
            temp[i].index = i 
        }
         console.log(temp)
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
        let checklist = {
            title: title,
            author: author,
            level: level,
            content: listItems
        }

        console.log(checklist)

        await axios.post('http://localhost:5007/' + 'checklists', checklist, 
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
                <main className='checklist-content'>
                {listItems.map(data => {
                    return <div className='checklist-item-div'>
                        <IconButton onClick={() => deleteItem(data.index)}>
                            <DeleteIcon sx={{color: 'white'}}/>
                        </IconButton>
                        <h3 className="list-item-h3">List Item {data.index + 1}: </h3><TextField onChange={e => handleListItemChange(e, data.index)} sx={{backgroundColor: '#e3e3e3', borderRadius: '5px', height: '100%', width: '80%'}}/>
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