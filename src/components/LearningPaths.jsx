import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Typography } from "@mui/material"
export default function LearningPaths(){
    const navigate = useNavigate()
    const [checklists, setLearningPaths] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const handleEditLearningPath = (checklist) => {
        navigate('edit/' + checklist._id, {state: {checklist: checklist}})
    }

    const handleViewLearningPath = (checklist) => {
        navigate('view/' + checklist._id, {state: {checklist: checklist}})
    }

    const handleCreateLearningPath = () => {
        navigate('create')
    }

    const deleteLearningPath = async(id) => {
        console.log('http://localhost:5007/' + 'checklists/' + id)
        await axios.delete('http://localhost:5007/' + 'checklists/' + id)
        .then(() => console.log("LearningPath Deleted"))
        
        let temp = checklists

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
            .then(data => data.isLoggedIn ? navigate('/checklists'):navigate('/login'))
        }

        const fetchLearningPaths = async() => {
            await fetch('http://localhost:5007/' + 'checklists')
            .then(res => res.json())
            .then(checklists => setLearningPaths(checklists))
        }

        verifyToken()
        fetchLearningPaths()
        setLoading(false)
    }, [])

    return(<main >
        {!loading ? 
        <div className='checklists-page'>
            <h1 className="home-h1">CHECKLISTS</h1>
            <button className='create-btn' onClick={handleCreateLearningPath}>Create New LearningPath</button>
            <div className="checklists-div">
                {checklists.map(checklist => {
                    return <div key={checklist._id} className='checklist-card'>
                        <div className='content-info'>
                            <Typography>{checklist.title}</Typography>
                            <Typography>{checklist.author}</Typography>
                        </div>
                        <div>
                            <button>View</button>
                            <button onClick={e=>handleEditLearningPath(checklist)}>Edit</button>
                            <button onClick={() => deleteLearningPath(checklist._id)}>Delete</button>
                        </div>
                    </div>
                })}
            </div>
        </div>:<span>Loading...</span>}
    </main>)
}