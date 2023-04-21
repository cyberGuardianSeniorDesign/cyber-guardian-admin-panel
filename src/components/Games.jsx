import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Typography } from "@mui/material"
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Tooltip from '@mui/material/Tooltip'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import Modal from '@mui/material/Modal'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export default function Games(){
    const navigate = useNavigate()
    const [games, setGames] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false)
    const [openSuccess, setOpenSuccess] = React.useState(false)
    const [successMsg, setSuccessMsg] = React.useState('')
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [focusedSwitch, setFocusedSwitch] = React.useState('')

    const handleEditGame = (game) => {
        navigate('edit/' + game._id, {state: {game: game}})
    }

    const handleCreateGame = () => {
        navigate('create')
    }

    const handleClose = () => {
        setOpenDeleteConfirmation(false)
    }

    const handleCloseSuccess = () => {
        setOpenSuccess(false)
    }

    const deleteGame = async(id) => {
        console.log(process.env.REACT_APP_BACKEND + 'games/' + id)
        await axios.delete(process.env.REACT_APP_BACKEND + 'games/' + id)
        .then(() => console.log("Games Deleted"))
        
        let temp = games

        for(let i = 0; i < temp.length; i++){
            if(temp[i]._id == id){
                temp.splice(i, 1)
            }
        }

        setGames(temp)
        forceUpdate()
    }

    React.useEffect(() => {
        const verifyToken = async() => {
            fetch(process.env.REACT_APP_BACKEND + "isAdminAuth", {
              headers: {
                "x-access-token": localStorage.getItem("token")
              }
            })
            .then(res => res.json())
            .then(data => data.isLoggedIn ? navigate('/games'):navigate('/login'))
        }

        const fetchGames = async() => {
            await fetch(process.env.REACT_APP_BACKEND + 'games')
            .then(res => res.json())
            .then(games => setGames(games))
        }

        verifyToken()
        fetchGames()
        setLoading(false)
    }, [])

    return(<main >
        {!loading ? 
        <div className='games-page'>
            <h1 className="home-h1">GAMES</h1>
            <button className='create-btn' onClick={handleCreateGame}>Add Game Switch</button>
            {games.length > 0 ?
            
            <TableContainer component={Paper} sx={{width: '80%', margin: '1em auto', minWidth: '600px'}}>
                <Table>
                <TableHead>
                    <TableRow sx={{width: '100%'}}>
                        <TableCell sx={{fontSize: 'larger'}}>Title</TableCell>
                        <TableCell sx={{fontSize: 'larger'}}>Running </TableCell>
                        <TableCell sx={{fontSize: 'larger'}}>Description</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                {games.map(game => {
                    return <TableRow key={game._id} className='game-card'>
                        <TableCell>{game.title}</TableCell>
                        <TableCell>{game.running ? "True": "False"}</TableCell>
                        <TableCell>{game.description}</TableCell>
                        <TableCell>
                            <Tooltip title='Edit'>
                                <IconButton onClick={e=>handleEditGame(game)}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                                <IconButton onClick={() => {
                                    setFocusedSwitch(game._id)
                                    setOpenDeleteConfirmation(true)
                                }}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                })}
                </Table>
            </TableContainer>
            : <p className='no-data-text'>No Games in Database.</p>}
            <Modal
                open={openDeleteConfirmation}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <div className="modal">
                    <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="600">
                     Delete Confirmation
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '20px', margin: '1em 2em' }}>
                    Are you sure you want to delete this game switch? (The game files will still be on the front end. They just won't be visible to the user.) 
                    </Typography>
                    <div>
                        <button className="dark-btn" onClick={() => {
                            deleteGame(focusedSwitch)
                            setSuccessMsg("Game Switch was Deleted")
                            setOpenSuccess(true)
                            handleClose()
                            }}>Yes</button>
                        <button className="dark-btn" onClick={handleClose}>No</button>
                    </div>
                </div>
            </Modal>
            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    {successMsg}
                </Alert>
            </Snackbar>
        </div>:<span>Loading...</span>}
    </main>)
}