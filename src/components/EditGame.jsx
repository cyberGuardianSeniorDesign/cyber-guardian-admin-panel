import React, { useEffect } from "react"
import axios from 'axios'
import { TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { v4 as uuid } from 'uuid';

export default function EditGame(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [loading, setLoading] = React.useState(true)
    const [game, setGame] = React.useState({})
    const [title, setTitle] = React.useState('')
    const [running, setRunning] = React.useState(true)
    const [desc, setDesc] = React.useState('')
    const [thumbnail, setThumbnail] = React.useState({})
    const [ogThumbnail, setOgThumbnail] = React.useState('')
    const [thumbnailName, setThumbnailName] = React.useState('Choose thumbnail file...')

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

    const patch = async() => {
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
            
            await axios.post(process.env.REACT_APP_BACKEND + "file",formData,config)
                    .then((response) => {
                        console.log("The file is successfully uploaded");
                    }).catch((error) => {
                        console.log(error)
                    }); 
            
            if(ogThumbnail != ''){
                await axios.post(process.env.REACT_APP_BACKEND + "file",formData,config)
                .then((response) => {
                    console.log("The file is successfully uploaded");
                }).catch((error) => {
                    console.log(error)
                }); 
            }
            
        } else if(thumbnailName !== 'Choose thumbnail file...'){
            finalThumbnail = ogThumbnail
        }

        let updatedGame = {
            title: title,
            description: desc,
            running: running,
            thumbnail: finalThumbnail
        }
        
        await axios.patch(process.env.REACT_APP_BACKEND + 'games/' + game._id, updatedGame,)
        .then(() => navigate('/games'))
        .catch(err => console.log(err))
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
                .then(data => data.isLoggedIn ? navigate('/checklists/edit/' + game._id):navigate('/login'))
        }

        const loadGame = () => {
            if(state != undefined || null){
                setGame(state.game)
                setTitle(state.game.title)
                setDesc(state.game.description)
                setRunning(state.game.running)
                setOgThumbnail(state.game.thumbnail)
                if(state.game.thumbnail !== ''){
                    setThumbnailName(state.game.thumbnail)
                }
                
                window.localStorage.setItem('state', JSON.stringify(state.game))
            } else {
                const data = window.localStorage.getItem('state')
                if(data != undefined || null)
                {
                    //verifyToken(data._id)
                    setGame(JSON.parse(data))

                    verifyToken()
                } 
            }
        }

        loadGame()
        setLoading(false)
    }, [])

    React.useEffect(() => {
        window.localStorage.setItem('state', JSON.stringify(game))
    }, [game])

    return<div>
            {!loading ?
            <div> 
            <main className='checklist-content'>
            
                <span className="content-info-span">
                    <h1 className='content-title'>Title: {title} </h1>
                </span>
                <span className="content-info-span">
                    <h2 className='content-title'>Description: </h2>
                    <TextField defaultValue={desc} placeholder="Learning path description..." onChange={handleDescriptionChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '65%'}}/>
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
                    <div className="running-state-div">
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
                    </div>
                </div>  
            <div className="button-div">
                {/* <form onSubmit={addImage}>
                    <label className="image-upload">
                        <input type="file" id="add-image" name="img" accept="image/png, image/jpeg" onChange={e => addImage(e)}></input>
                        Add Image
                    </label>
                </form> */}
                <button className='post-btn' onClick={patch}>Update</button>
            </div>
            </main>
        </div>
            :<h1>Loading...</h1>}
        </div>
}