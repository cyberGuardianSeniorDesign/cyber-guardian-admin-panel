import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Typography } from "@mui/material"
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Tooltip from '@mui/material/Tooltip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Modal from '@mui/material/Modal'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { ArrowBack } from "@material-ui/icons";
import CircularProgress from "@mui/material/CircularProgress";

export default function LearningPaths(){
    const navigate = useNavigate()
    const [learningPaths, setLearningPaths] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false)
    const [openSuccess, setOpenSuccess] = React.useState(false)
    const [successMsg, setSuccessMsg] = React.useState('')
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [focusedPath, setFocusedPath] = React.useState('')

    const goHome = () => {
        navigate('/../')
    }

    const handleEditLearningPath = (learningPath) => {
        navigate('edit/' + learningPath._id, {state: {learningPath: learningPath}})
    }

    const handleViewLearningPath = (learningPath) => {
        navigate('view/' + learningPath._id, {state: {learningPath: learningPath}})
    }

    const handleCreateLearningPath = () => {
        navigate('create')
    }

    
    const handleClose = () => {
        setOpenDeleteConfirmation(false)
    }

    const handleCloseSuccess = () => {
        setOpenSuccess(false)
    }

    const deleteLearningPath = async(id) => {
        console.log(process.env.REACT_APP_BACKEND + 'learning-paths/' + id)
        await axios.delete(process.env.REACT_APP_BACKEND + 'learning-paths/' + id)
        .then(() => console.log("LearningPath Deleted"))
        
        let temp = learningPaths

        for(let i = 0; i < temp.length; i++){
            if(temp[i]._id == id){
                temp.splice(i, 1)
            }
        }

        setLearningPaths(temp)
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
            .then(data => data.isLoggedIn ? navigate('/learning-paths'):navigate('/login'))
        }

        const fetchLearningPaths = async() => {
            await fetch(process.env.REACT_APP_BACKEND + 'learning-paths')
            .then(res => res.json())
            .then(learningPaths => setLearningPaths(learningPaths))
        }

        verifyToken()
        fetchLearningPaths()
        setTimeout(() => setLoading(false), 400)
    }, [])

    return(<main >
        {!loading ? 
        <div className='checklists-page'>
             <IconButton onClick={goHome} sx={{color: 'white', display: 'absolute', right: '40%'}}>
                <ArrowBack /> <Typography sx={{fontSize: '16px'}}>Go Back</Typography>
            </IconButton>
            <h1 className="home-h1">LEARNING PATHS</h1>
            <button className='create-btn' onClick={handleCreateLearningPath}>Create New Learning Path</button>
            {learningPaths.length > 0 ?
            
            <TableContainer component={Paper} sx={{width: '80%', margin: '1em auto', minWidth: '600px'}}>
                <Table>
                <TableHead>
                    <TableRow sx={{width: '100%'}}>
                        <TableCell sx={{fontSize: 'larger'}}>Title</TableCell>
                        <TableCell sx={{fontSize: 'larger'}}>Author</TableCell>
                        <TableCell sx={{fontSize: 'larger'}}>Level</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {learningPaths.map(learningPath => {
                    return <TableRow key={learningPath._id} className='checklist-card'>
                        <TableCell>{learningPath.title}</TableCell>
                        <TableCell>{learningPath.author}</TableCell>
                        <TableCell>{learningPath.level}</TableCell>
                        <TableCell>
                            <Tooltip title='View'>
                                <IconButton onClick={() => handleViewLearningPath(learningPath)}>
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Edit'>
                                <IconButton onClick={()=>handleEditLearningPath(learningPath)}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                                <IconButton onClick={() => {
                                    setFocusedPath(learningPath._id)
                                    setOpenDeleteConfirmation(true)
                                }}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                })}
                </TableBody>
                </Table>
            </TableContainer>
            : <p className='no-data-text'>No Learning Paths in Database.</p>}
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
                    Are you sure you want to delete this learning path? 
                    </Typography>
                    <div>
                        <button className="dark-btn" onClick={() => {
                            deleteLearningPath(focusedPath)
                            setSuccessMsg("Learning Path was Deleted")
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
        </div>:<div className="loading-div"><CircularProgress color="inherit" sx={{position: 'relative', top: '40%', color: 'white'}}/></div>}
    </main>)
}