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
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import { v4 as uuid } from 'uuid';
export default function EditLearningPath(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const [data, setData] = React.useState({})
    const [learningPath, setLearningPath] = React.useState({})
    const [checklists, setChecklists] = React.useState([])
    const [articles, setArticles] = React.useState([])
    const [games, setGames] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [desc, setDesc] = React.useState('')
    const [content, setContent] = React.useState([])
    const [newContent, setNewContent] = React.useState([])
    const [openModal, setOpenModal] = React.useState(false)
    const [openTypeModal, setOpenTypeModal] = React.useState(false)
    const [typeRadio, setTypeRadio] = React.useState('article')
    const [radioValue, setRadioValue] = React.useState({})
    const [thumbnail, setThumbnail] = React.useState({})
    const [ogThumbnail, setOgThumbnail] = React.useState('')
    const [thumbnailName, setThumbnailName] = React.useState('Choose thumbnail file...')
    const [, updateState] = React.useState()
    const forceUpdate = React.useCallback(() => updateState({}), [])

    const addThumbnail = (e) => {
        setThumbnail(e.target.files[0])

        setThumbnailName(e.target.files[0].name)
    }

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

    const handleClose = () => {
        setOpenModal(false)
        setRadioValue('')
        setTypeRadio('article')
    }

    const handleCloseType = () => {
        setOpenTypeModal(false)
    }

    const pickContent = () => {
        setOpenTypeModal(true)
        forceUpdate()
    }

    const addContent = () => {
        let temp = content

        let data = {}

        let key = uuid()

        let newData

        if(typeRadio == 'article'){
            data = articles.find(article => article._id == radioValue)
            newData = {
                index: key,
                contentType: typeRadio,
                title: data.title,
                img: data.thumbnail,
                data: data,
                description: '',
                link: data._id,
                new: true
            }
        } else if(typeRadio == 'checklist')
        {
            data = checklists.find(checklist => checklist._id == radioValue)
            console.log(data)
            newData = {
                index: key,
                contentType: typeRadio,
                title: data.title,
                img: data.thumbnail,
                data: data,
                description: '',
                link: data._id,
                new: true
            }
        } else if(typeRadio == 'game')
        {
            data = games.find(game => game._id == radioValue)
            let gameLink = data.title.toLowerCase().replace(/\s+/g,"-")
            newData = {
                index: key,
                contentType: typeRadio,
                title: data.title,
                img: data.thumbnail,
                data: data,
                description: '',
                link: gameLink,
                new: true
            }
        }

         

        temp.push(newData)
        setNewContent([...temp])
        handleClose()
    }

    const handleContentDescChange = (event, item) => {
        let temp
        let arrIdx
        if(item.new){
            temp = newContent
            arrIdx = newContent.findIndex(data => data.index == item.index)
            newContent[arrIdx].description = event.target.value 
            setNewContent([...temp])
        } else {
            temp = content
            arrIdx = content.findIndex(data => data.index == item.index)
            content[arrIdx].description = event.target.value
            setContent([...temp])
        }
    }

    const deleteItem = (index) => {
        let temp = content 
        let idx = temp.findIndex(item => item.index == index)
        temp.splice(idx, 1)
        
        setContent([...temp])
    }

    const handleTypeChange = (event) => {
        setTypeRadio(event.target.value)
    }

    const handleRadioChange = (event) => {
        console.log(event.target.value)
        setRadioValue(event.target.value)
    }

    const nextClick = () => {
        setOpenModal(true)
        handleCloseType()
    }

    const loadContentChoices = () => {
        if(typeRadio == 'article'){
            return <RadioGroup
            value={radioValue}
            onChange={handleRadioChange}
        >
           <h3>Articles</h3>
           <Table>
                <TableHead>
                    <TableRow sx={{width: '100%'}}>
                        <TableCell sx={{fontSize: 'large'}}>Title</TableCell>
                        <TableCell sx={{fontSize: 'large'}}>Author</TableCell>
                        <TableCell sx={{fontSize: 'large'}}>Level</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                {articles.map(article => {
                    return <TableRow>
                        <TableCell><FormControlLabel key={article._id} value={article._id} control={<Radio/>} label={article.title} /></TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>{article.level}</TableCell>
                    </TableRow>
                })}
           </Table>
        </RadioGroup>
        } 
        else if(typeRadio == 'checklist'){
            return <RadioGroup
            value={radioValue}
            onChange={handleRadioChange}
            >
                <h3>Checklists</h3>
                <Table>
                    <TableHead>
                        <TableRow sx={{width: '100%'}}>
                            <TableCell sx={{fontSize: 'large'}}>Title</TableCell>
                            <TableCell sx={{fontSize: 'large'}}>Author</TableCell>
                            <TableCell sx={{fontSize: 'large'}}>Level</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    {console.log(checklists)}
                    {checklists.map(checklist => {
                        return <TableRow>
                            <TableCell><FormControlLabel key={checklist._id} value={checklist._id} control={<Radio/>} label={checklist.title} /></TableCell>
                            <TableCell>{checklist.author}</TableCell>
                            <TableCell>{checklist.level}</TableCell>
                        </TableRow>
                    })}
                </Table>
            </RadioGroup>
        }
        else if(typeRadio == 'game'){
            return <RadioGroup
            value={radioValue}
            onChange={handleRadioChange}
            >
                <h3>Games</h3>
                <Table>
                    <TableHead>
                        <TableRow sx={{width: '100%'}}>
                            <TableCell sx={{fontSize: 'large'}}>Title</TableCell>
                            <TableCell sx={{fontSize: 'large'}}>Author</TableCell>
                            <TableCell sx={{fontSize: 'large'}}>Level</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    {games.map(game => {
                        return <TableRow>
                            <TableCell><FormControlLabel key={game._id} value={game._id} control={<Radio/>} label={game.author} /></TableCell>
                            <TableCell>{game.author}</TableCell>
                            <TableCell>{game.level}</TableCell>
                        </TableRow>
                    })}
                </Table>
            </RadioGroup>
        }
    }

    const patch = async() => {
        

        console.log(ogThumbnail)
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
            
        } else if(thumbnailName !== 'Choose thumbnail file...'){
            finalThumbnail = ogThumbnail
        }

        let update = {
            title: title,
            author: author,
            level: level,
            description: desc,
            content: content,
            thumbnail: finalThumbnail
        }

        console.log(update)

        await axios.patch(process.env.REACT_APP_BACKEND + 'learning-paths/' + learningPath._id, update, 
        {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(() => navigate('/learning-paths'))
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
                .then(data => data.isLoggedIn ? navigate('/learning-paths/edit/' + learningPath._id):navigate('/login'))
        }

        const loadLearningPath= () => {
            if(state != undefined || null){
                setLearningPath(state.learningPath)
                setContent(state.learningPath.content)
                setTitle(state.learningPath.title)
                setAuthor(state.learningPath.author)
                setLevel(state.learningPath.level)
                setDesc(state.learningPath.description)
                //only et thumbnailName if article has thumbnail currently
                if(state.learningPath.thumbnail !== ''){
                    setOgThumbnail(state.learningPath.thumbnail)
                    setThumbnailName(state.learningPath.thumbnail)
                }
                window.localStorage.setItem('state', JSON.stringify(state.article))
            } else {
                const data = window.localStorage.getItem('state')
                if(data != undefined || null)
                {
                    //verifyToken(data._id)
                    setLearningPath(JSON.parse(data))

                    verifyToken()
                } 
            }
        }

        const getContent = async() => {
            let content = await axios.get(process.env.REACT_APP_BACKEND + 'content')
            setData(content.data)
            setArticles(content.data.articles)
            setChecklists(content.data.checklists)
            setGames(content.data.games)
            
        }

        const loadPage = () => {
            if((data != undefined || {}) && (articles != undefined || null) && (checklists != undefined || null)){
                
                setLoading(false)
            } else {
                setTimeout(loadPage, 1000)
            }
        }

        loadLearningPath()
        getContent()
        loadPage()
    }, [])

    React.useEffect(() => {
        window.localStorage.setItem('state', JSON.stringify(learningPath))
    }, [learningPath])

    return<div>
            {!loading ?
            <div> 
                <header className="content-header">
                    <span className="content-info-span">
                        <h1 className='content-title'>Title: </h1>
                        <TextField defaultValue={title} placeholder="Super Interesting Title" onChange={handleTitleChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
                    </span>
                    <span className="content-info-span">
                        <h2 className="content-author">By:</h2>
                        <TextField defaultValue={author} placeholder="Author" onChange={handleAuthorChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px'}}/>
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
                    <span className="content-info-span">
                        <h2 className='content-title'>Description: </h2>
                        <TextField placeholder="Learning path description..." defaultValue={desc} value={desc} onChange={handleDescriptionChange} sx={{backgroundColor: '#FFF2F2', borderRadius: '5px', width: '65%'}}/>
                    </span>
                </header>

            {content != [] ? <main className='learning-path-main'>
                {content.map(data => {
                    return <div className='create-learning-path-content-div'>
                        <Tooltip>
                        <IconButton onClick={() => deleteItem(data.index)} sx={{position: 'relative', left: '-50%'}}>
                            <DeleteIcon sx={{color: '#1f1f28'}}/>
                        </IconButton>
                        </Tooltip>
                        <h3 className='content-title-h3'>{data.contentType}: {data.title}</h3>
                        <TextField rows={10} multiline placeholder="Content Description..." value={data.description} onChange={e => handleContentDescChange(e, data)} sx={{width: '90%'}} />
                        
                    </div>
                })}
                <div className="button-div">
                    <button className='add-txt-btn' onClick={pickContent}>Add Content</button>
                    <button className='post-btn' onClick={patch}>Update</button>
                </div>
                </main>:  <p className='no-data-text'>Add an article/checklist/game to your learning path to get started.</p>}
                
            <Modal
                open={openTypeModal}
                onClose={handleCloseType}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='modal-div'>
                    <h3>Choose Type of Content to Add</h3>
                    <FormControl>
                        <RadioGroup
                            value={typeRadio}
                            onChange={handleTypeChange}
                        >
                            <FormControlLabel value='article' control={<Radio/>} label='Article'/>
                            <FormControlLabel value='checklist' control={<Radio/>} label='Checklist'/>
                            <FormControlLabel value='game' control={<Radio/>} label='Game'/>
                        </RadioGroup>
                    </FormControl>
                    <button className="dark-btn" onClick={nextClick}>Next</button>
                </div>
            </Modal>
            
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='modal-div'>
                    <TableContainer sx={{minwidth: '400px', width: '80%'}}>
                        <FormControl>
                            {loadContentChoices()}
                        </FormControl>
                    </TableContainer>
                    <button className="dark-btn" onClick={addContent}>Add</button>
                    <button className="dark-btn" onClick={handleClose}>Cancel</button>
                </div>
            </Modal>
            </div>
            :<h1>Loading...</h1>}

        </div>
}