import React, { useEffect } from "react"
import axios from 'axios'
import { Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, convertFromRaw, ContentState  } from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ReactHtmlParser from 'react-html-parser'; 
export default function ViewArticle({dbArticle})
{
    const navigate = useNavigate()
    const { state } = useLocation()
    const [loading, setLoading] = React.useState(true)
    const [article, setArticle] = React.useState(dbArticle)
    const [title, setTitle] = React.useState('')
    const [author, setAuthor] = React.useState('')
    const [level, setLevel] = React.useState('Apprentice')
    const [content, setContent] = React.useState([])

    React.useEffect(() => {
      const verifyToken = async() => {
              fetch(process.env.BACKEND + "isAdminAuth", {
              headers: {
                  "x-access-token": localStorage.getItem("token")
              }
              })
              .then(res => res.json())
              .then(data => data.isLoggedIn ? navigate('/articles/view/' + article._id):navigate('/login'))
      }

      
      const loadArticle = () => {
          if(state != undefined || null){
              setArticle(state.article)
              setContent(state.article.content)
              setTitle(state.article.title)
              setAuthor(state.article.author)
              setLevel(state.article.level)
              window.localStorage.setItem('state', JSON.stringify(state.article))
          } else {
              const data = window.localStorage.getItem('state')
              if(data != undefined || null)
              {
                  //verifyToken(data._id)
                  setArticle(JSON.parse(data))

                  verifyToken()
              } 
          }
      }

      const loadContentRaw = () => {
        if (content.raw != undefined || null)
        {
          EditorState.createWithContent(convertFromRaw(JSON.parse(content.raw)))
          setTimeout(() => setLoading(false), 500)
          
        } 
        else 
        {
          setTimeout(loadArticle, 1000);
        }
      }

        loadArticle()
        loadContentRaw()
        setLoading(false)
    }, [])

    React.useEffect(() => {
        window.localStorage.setItem('state', JSON.stringify(article))
    }, [article])

    return<div>
      {!loading ? <div className='view-page'> 
        <h1 className='view-page-title'>{article.title}</h1>
        <div className="article-content-info">
          <p className="view-page-info">Written By {author}</p>
          <p className="view-page-info">Level: {level}</p>
        </div>
        {article.content.map(content => {
        if(content.contentType == 'text'){
          let html = draftToHtml(JSON.parse(content.raw))
          console.log(html)
          return <div className="article-text-content" key={content.index}>{ReactHtmlParser(html)}</div>
        } else {
          return <div key={content.index} className="view-page-img-div">
            <h3 className="view-page-img-h3">{content.caption}</h3>
            <img className="view-page-img" src={"https://storage.googleapis.com/cyber-guardian-images/" + content.text} alt={content.caption}/>
            </div>
        }
      })}

      </div>: <h1>Loading...</h1>}

    </div>
}