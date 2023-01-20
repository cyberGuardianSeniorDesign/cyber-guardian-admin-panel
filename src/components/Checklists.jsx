import React from "react"
import axios from 'axios'
import { Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
export default function Checklists({checklists}){
    const navigate = useNavigate()
    const [lists, setLists] = React.useState(checklists)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const verifyToken = async() => {
            fetch("http://localhost:5007/isAdminAuth", {
              headers: {
                "x-access-token": localStorage.getItem("token")
              }
            })
            .then(res => res.json())
            .then(data => data.isLoggedIn ? navigate('/checklists'):navigate('/login'))
          }
        const loadChecklists = () => {
            if(checklists !== undefined || null){
                setLists(checklists)
                setLoading(false)
            }
            else {
                //loadChecklists()
            }
        }
        
        loadChecklists()
    }, [])

    return(<main className='Checklists'>
        {!loading ? 
        <div>
            <h1>Checklists</h1>
            <button>Create New Checklists</button>
            {lists.map(list => {
                return <div className='checklist-card'>
                    <Typography>{list.title}</Typography>
                    <Typography>{list.author}</Typography>
                    <button>View</button>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            })}
        </div>:<span>Loading...</span>}
    </main>)
}