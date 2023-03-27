import React, { useEffect } from "react"
import axios from 'axios'
import { Typography } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'



export default function ViewChecklist({dbChecklist})
{
    const navigate = useNavigate()
    const { state } = useLocation()
    const [loading, setLoading] = React.useState(false)
    const [checklist, setChecklist] = React.useState(dbChecklist)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [desc, setDesc] = React.useState('')
    const [listItems, setListItems] = React.useState([{index: 0, contentType: 'text', text: ''}])
    const [checked, setChecked] = React.useState([0]);

    React.useEffect(() => {
      const verifyToken = async() => {
              fetch(process.env.BACKEND + "isAdminAuth", {
              headers: {
                  "x-access-token": localStorage.getItem("token")
              }
              })
              .then(res => res.json())
              .then(data => data.isLoggedIn ? navigate('/checklists/edit/' + checklist._id):navigate('/login'))
      }

      const loadChecklist = () => {
          if(state != undefined || null){
              setChecklist(state.checklist)
              setListItems(state.checklist.content)
              setTitle(state.checklist.title)
              setAuthor(state.checklist.author)
              setLevel(state.checklist.level)
              setDesc(state.checklist.description)
              window.localStorage.setItem('state', JSON.stringify(state.checklist))
          } else {
              const data = window.localStorage.getItem('state')
              if(data != undefined || null)
              {
                  setChecklist(JSON.parse(data))

                  verifyToken()
              } 
          }
      }

      loadChecklist()
      setLoading(false)
  }, [])

  React.useEffect(() => {
      window.localStorage.setItem('state', JSON.stringify(checklist))
  }, [checklist])


    return <div className='view-page'>
        {!loading ? <div>
          <h1 className='view-page-title'>{title}</h1>
          <p className="view-page-description">{desc}</p>
          <div className="checklist-view-div">
          <FormGroup>
      
    
          {listItems.map((listItem) => {
            const labelId = `checkbox-list-label-${listItem.index}`;

            if(listItem.contentType == 'text'){
              return (
                <FormControlLabel control={<Checkbox  sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}/>} label={<h3 className='checklist-text'>{listItem.text}</h3>} sx={{fontSize: 24,fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', fontWeight: '900', padding: '.5em', textAlign: 'left'}}/>
              );
            } else {
              return <img className='view-page-img' src={"https://storage.googleapis.com/cyber-guardian-images/" + listItem.text} alt={listItem.caption}/>
            }
          })}
          </FormGroup>
        </div>
      </div> : <h1>Loading...</h1>}
    </div>
}