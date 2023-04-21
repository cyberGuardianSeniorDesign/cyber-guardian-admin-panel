import React from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Button } from "@mui/material";

export default function Home(){
  const navigate = useNavigate()

    const [data, setData] = React.useState({})
    const [articles, setArticles] = React.useState([])
    const [checklists, setChecklists] = React.useState([])
    const [learningPaths, setLearningPaths] = React.useState([])
    const [loading, setLoading] = React.useState(true)

  const toArticles = () => {
    navigate('/articles')
  }

  const toChecklists = () => {
    navigate('/checklists')
  }

  const toLearningPaths = () => {
    navigate('/learning-paths')
  }

  const toGames = () => {
    navigate('/games')
  }

    React.useEffect(() => {
      const verifyToken = async() => {
        fetch(process.env.REACT_APP_BACKEND + "isAdminAuth", {
          headers: {
            "x-access-token": localStorage.getItem("token")
          }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? navigate('/'):navigate('/login'))
      }
      const getData = async() => {
        await axios.get(process.env.REACT_APP_BACKEND + 'content')
        .then(res => setData(res.data))
        
        setArticles(data.articles)
        setChecklists(data.checklists)
        setLearningPaths(data.learningPaths)  
      }
  
      fetch(process.env.REACT_APP_BACKEND + "isAdminAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
       })
      .then(res =>res.json())
      .then(data => data.isLoggedIn ? navigate("/"): null)

      verifyToken()
      getData().then(setLoading(false))
    }, [])
  
    return(<main className='Home'>
        {!loading ? <div>
          <h1 className='home-h1'>Choose a Type of Content to Interact with</h1>
          <div className="content-row">
            <button className='content-button' onClick={toArticles}>Articles</button>
            <button className='content-button' onClick={toChecklists}>Checklists</button>
          </div>
          <div className="content-row">
            <button className='content-button' onClick={toLearningPaths}>Learning Paths</button>
            <button className='content-button' onClick={toGames}>Games</button>
          </div>
        </div>:<span>Loading...</span>}
    </main>)
}