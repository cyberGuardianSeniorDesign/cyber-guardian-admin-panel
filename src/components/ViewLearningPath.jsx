import React, { useEffect } from "react"
import axios from 'axios'
import { Typography } from "@mui/material"
import { Link, useLocation, useNavigate } from "react-router-dom"

import CircularProgress from '@mui/material/CircularProgress';

export default function ViewLearningPath({dbPath})
{
    const navigate = useNavigate()
    const { state } = useLocation()
    const [loading, setLoading] = React.useState(true)
    const [path, setPath] = React.useState(dbPath)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [content, setContent] = React.useState([])
    const [description, setDescription] = React.useState('')
    let contentState 
    const renavigate = async(contentType, objectId, data) => {
        let param1;

        switch(contentType){
            case 'article':
                param1 = 'articles/';
                break;
            case 'checklist':
                param1 = 'checklists/';
                break;
            default:
                param1 = 'articles/'
                break;
        }
        
        await axios.get(process.env.REACT_APP_BACKEND + param1 + objectId)
        .then(res => () => {
            contentState= res.data
        })
        .catch(err => console.log(err))
        console.log(data)
        navigate('/../../' + contentType + 's/' + objectId, {state: {content: data}} )

        
    }
    React.useEffect(() => {
      const loadLearningPath = () => {
          if(state != undefined || null){
              setPath(state.learningPath)
              setContent(state.learningPath.content)
              setTitle(state.learningPath.title)
              setAuthor(state.learningPath.author)
              setLevel(state.learningPath.level)

              window.localStorage.setItem('state', JSON.stringify(state.learningPath))
          } else {
              const data = window.localStorage.getItem('state')
              if(data != undefined || null)
              {
                  //verifyToken(data._id)
                  setPath(JSON.parse(data))

              } 
          }
      }

        loadLearningPath()
        setTimeout(() => setLoading(false), 500)
    }, [])

    React.useEffect(() => {
        window.localStorage.setItem('state', JSON.stringify(path))
    }, [path])

    return<div>
      {!loading ? <div className='view-page'> 
        <h1 className='view-page-title'>{path.title}</h1>
        <p className="view-page-description">{path.description}</p>
        {content.map(data => {
            return <div className="learning-path-content-div">
                <h4 className="learning-path-h4">{data.title}</h4>
                <center><img className="lp-img" src={"https://storage.googleapis.com/cyber-guardian-images/" + data.img} alt={`${data.title} thumbnail`}/></center>
                <p className="learning-path-content-desc">{data.description}</p>
                <button className="navigate-button" onClick={() => renavigate(data.contentType, data.link, data.data)} >Click here to check it out!</button>
            </div>
        })}
      </div>: <div className="loading-div"><CircularProgress color="inherit" sx={{position: 'relative', top: '40%', left: '47%'}}/></div>}
    </div>
}