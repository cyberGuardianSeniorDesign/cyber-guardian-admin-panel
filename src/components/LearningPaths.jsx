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
export default function LearningPaths(){
    const navigate = useNavigate()
    const [learningPaths, setLearningPaths] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleEditLearningPath = (learningPath) => {
        navigate('edit/' + learningPath._id, {state: {learningPath: learningPath}})
    }

    const handleViewLearningPath = (learningPath) => {
        navigate('view/' + learningPath._id, {state: {learningPath: learningPath}})
    }

    const handleCreateLearningPath = () => {
        navigate('create')
    }

    const deleteLearningPath = async(id) => {
        console.log('http://localhost:5007/' + 'learning-paths/' + id)
        await axios.delete('http://localhost:5007/' + 'learning-paths/' + id)
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
            fetch('http://localhost:5007/' + "isAdminAuth", {
              headers: {
                "x-access-token": localStorage.getItem("token")
              }
            })
            .then(res => res.json())
            .then(data => data.isLoggedIn ? navigate('/learning-paths'):navigate('/login'))
        }

        const fetchLearningPaths = async() => {
            await fetch('http://localhost:5007/' + 'learning-paths')
            .then(res => res.json())
            .then(learningPaths => setLearningPaths(learningPaths))
        }

        verifyToken()
        fetchLearningPaths()
        setLoading(false)
    }, [])

    return(<main >
        {!loading ? 
        <div className='checklists-page'>
            <h1 className="home-h1">CHECKLISTS</h1>
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
                {learningPaths.map(learningPath => {
                    return <TableRow key={learningPath._id} className='checklist-card'>
                        <TableCell>{learningPath.title}</TableCell>
                        <TableCell>{learningPath.author}</TableCell>
                        <TableCell>{learningPath.level}</TableCell>
                        <TableCell>
                            <Tooltip title='View'>
                                <IconButton>
                                    <VisibilityIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Edit'>
                                <IconButton onClick={()=>handleEditLearningPath(learningPath)}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                                <IconButton onClick={() => deleteLearningPath(learningPath._id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                })}
                </Table>
            </TableContainer>
            : <p className='no-data-text'>No Learning Paths in Database.</p>}
        </div>:<span>Loading...</span>}
    </main>)
}