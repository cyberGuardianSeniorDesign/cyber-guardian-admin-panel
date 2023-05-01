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
import { ArrowBack } from "@material-ui/icons";
import CircularProgress from "@mui/material/CircularProgress";

export default function Games(){
    const navigate = useNavigate()
    const [games, setGames] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false)
    const [openSuccess, setOpenSuccess] = React.useState(false)
    const [successMsg, setSuccessMsg] = React.useState('')
    const [focusedSwitch, setFocusedSwitch] = React.useState('')

    const handleEditGame = (game) => {
        navigate('edit/' + game._id, {state: {game: game}})
    }

    const goHome = () => {
        navigate('/../')
    }

    const handleClose = () => {
        setOpenDeleteConfirmation(false)
    }

    const handleCloseSuccess = () => {
        setOpenSuccess(false)
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
        setTimeout(() => setLoading(false), 400)
    }, [])

    return(<main >
        {!loading ? 
        <div className='games-page'>
            <IconButton onClick={goHome} sx={{color: 'white', display: 'absolute', right: '40%'}}>
                <ArrowBack /> <Typography sx={{fontSize: '16px'}}>Go Back</Typography>
            </IconButton>
            <h1 className="home-h1">GAMES</h1>
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
                <TableBody>
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
                           
                        </TableCell>
                    </TableRow>
                })}
                </TableBody>
                </Table>
            </TableContainer>
            : <p className='no-data-text'>No Games in Database.</p>}
            
            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    {successMsg}
                </Alert>
            </Snackbar>
        </div>:<div className="loading-div"><CircularProgress color="inherit" sx={{position: 'relative', top: '40%', color: 'white'}}/></div>}
    </main>)
}