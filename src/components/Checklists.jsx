import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Typography } from "@mui/material"
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Tooltip from '@mui/material/Tooltip'

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
            <div className="checklists-div">
                {checklists.map(checklist => {
                    return <div key={checklist._id} className='checklist-card'>
                        <div className='content-info'>
                            <Typography>{checklist.title}</Typography>
                            <Typography>{checklist.author}</Typography>
                        </div>
                        <div>
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
                        </div>
                    </div>
                })}
            </div>: <p className='no-data-text'>No Checklists in Database.</p>}
        </div>:<span>Loading...</span>}
    </main>)
}