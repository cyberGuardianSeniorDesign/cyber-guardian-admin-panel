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

export default function Checklists(){
    const navigate = useNavigate()
    const [checklists, setChecklists] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleEditChecklist = (checklist) => {
        navigate('edit/' + checklist._id, {state: {checklist: checklist}})
    }

    const handleViewChecklist = (checklist) => {
        navigate('view/' + checklist._id, {state: {checklist: checklist}})
    }

    const handleCreateChecklist = () => {
        navigate('create')
    }

    const deleteChecklist = async(id) => {
        console.log('http://localhost:5007/' + 'checklists/' + id)
        await axios.delete('http://localhost:5007/' + 'checklists/' + id)
        .then(() => console.log("Checklist Deleted"))
        
        let temp = checklists

        for(let i = 0; i < temp.length; i++){
            if(temp[i]._id == id){
                temp.splice(i, 1)
            }
        }

        setChecklists(temp)
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
            .then(data => data.isLoggedIn ? navigate('/checklists'):navigate('/login'))
        }

        const fetchChecklists = async() => {
            await fetch('http://localhost:5007/' + 'checklists')
            .then(res => res.json())
            .then(checklists => setChecklists(checklists))
        }

        verifyToken()
        fetchChecklists()
        setLoading(false)
    }, [])

    return(<main >
        {!loading ? 
        <div className='checklists-page'>
            <h1 className="home-h1">CHECKLISTS</h1>
            <button className='create-btn' onClick={handleCreateChecklist}>Create New Checklist</button>
            {checklists.length > 0 ?
            
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
                {checklists.map(checklist => {
                    return <TableRow key={checklist._id} className='checklist-card'>
                        <TableCell>{checklist.title}</TableCell>
                        <TableCell>{checklist.author}</TableCell>
                        <TableCell>{checklist.level}</TableCell>
                        <TableCell>
                            <Tooltip title='View'>
                                <IconButton>
                                    <VisibilityIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Edit'>
                                <IconButton onClick={e=>handleEditChecklist(checklist)}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                                <IconButton onClick={() => deleteChecklist(checklist._id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                })}
                </Table>
            </TableContainer>
            : <p className='no-data-text'>No Checklists in Database.</p>}
        </div>:<span>Loading...</span>}
    </main>)
}