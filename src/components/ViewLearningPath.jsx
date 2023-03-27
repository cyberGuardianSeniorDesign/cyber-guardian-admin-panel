import React, { useEffect } from "react"
import axios from 'axios'
import { Typography } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"


export default function ViewLearningPath({dbLearningPath})
{
  const navigate = useNavigate()
  const { state } = useLocation()
  const [loading, setLoading] = React.useState(true)
  const [learningPath, setLearningPath] = React.useState(dbLearningPath)
  const [title, setTitle] = React.useState('')
  const [author, setAuthor] = React.useState('')
  const [level, setLevel] = React.useState('Apprentice')
  const [desc, setDesc] = React.useState('')
  const [content, setContent] = React.useState([])
    
  React.useEffect(() => {
    const verifyToken = async() => {
            fetch(process.env.BACKEND + "isAdminAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
            })
            .then(res => res.json())
            .then(data => data.isLoggedIn ? navigate('/learning-paths/edit/' + learningPath._id):navigate('/login'))
    }

    const loadLearningPath= () => {
        if(state != undefined || null){
            setLearningPath(state.learningPath)
            setContent(state.learningPath.content)
            setTitle(state.learningPath.title)
            setAuthor(state.learningPath.author)
            setLevel(state.learningPath.level)
            setDesc(state.learningPath.description)
            window.localStorage.setItem('state', JSON.stringify(state.article))
        } else {
            const data = window.localStorage.getItem('state')
            if(data != undefined || null)
            {
                //verifyToken(data._id)
                setLearningPath(JSON.parse(data))

                verifyToken()
            } 
        }
    }

      const loadPage = () => {
          if(learningPath != null || undefined){
              
              setLoading(false)
          } else {
              setTimeout(loadPage, 1000)
          }
      }

          loadLearningPath()
          loadPage()
    }, [])

    React.useEffect(() => {
        window.localStorage.setItem('state', JSON.stringify(learningPath))
    }, [learningPath])


    return<div>
        {!loading ? <div className='view-page'> 
        <h1 className='view-page-title'>{learningPath.title}</h1>
        <p className="view-page-description">{learningPath.description}</p>

        <ol>
          {learningPath.content.map(content => {
              return <div key={content.index}>
                <h2 className='view-page-h2'>{content.contentType}: {content.title}</h2> 
                <img className="view-lp-img" src={content.thumbnail ? "https://storage.googleapis.com/cyber-guardian-images/" + content.thumbnail : 'images/img-3.jpg'} alt='Content Thumbnail'/>
                <p className="view-page-text">{content.description}</p>
                <a className="lp-link" href={content.link}>Click here to check it out.</a>
              </div>
          })}
        </ol>

      </div>: <h1>Loading...</h1>}
    </div>
}