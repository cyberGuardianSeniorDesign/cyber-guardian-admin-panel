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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
export default function CreateGame(){
    const navigate = useNavigate()
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [running, setRunning] = React.useState(true)
    const [desc, setDesc] = React.useState('')
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleTitleChange = e => {
        setTitle(e.target.value)
    }

    const handleDescriptionChange = e => {
        setDesc(e.target.value)
    }

    const handleRunningChange = e => {
        if (e.target.value == 'true'){
            setRunning(true)
        } else {
            setRunning(false)
        }
    }

    const post = async() => {
        let game = {
            title: title,
            description: desc,
            running: running
        }

        await axios.post('http://localhost:5007/' + 'games', game, 
        {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(() => navigate('/games'))
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
                .then(data => data.isLoggedIn ? navigate('/games/create'):navigate('/login'))
        }

        verifyToken()
        setLoading(false)
    }, [])


    return<div>
            {!loading ?
            <div> 
                <main className='checklist-content'>
                
                    <span className="content-info-span">
                        <h1 className='content-title'>Title: </h1>
                        <TextField placeholder="Super Interesting Title" onChange={handleTitleChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
                    </span>
                    <span className="content-info-span">
                        <h2 className='content-title'>Description: </h2>
                        <TextField placeholder="Learning path description..." onChange={handleDescriptionChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '65%'}}/>
                    </span>
                    <h2 className="content-title">Running State:</h2>
                    <FormControl>
                        <RadioGroup
                            value={running}
                            onChange={handleRunningChange}
                        >
                            <FormControlLabel value="true" control={<Radio/>} label='True' sx={{color: 'white'}}/>
                            <FormControlLabel value="false" control={<Radio/>} label='False' sx={{color: 'white'}}/>
                        </RadioGroup>
                    </FormControl>
                <div className="button-div">
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