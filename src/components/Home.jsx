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
        fetch("http://localhost:5007/isAdminAuth", {
          headers: {
            "x-access-token": localStorage.getItem("token")
          }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? navigate('/'):navigate('/login'))
      }

      const getData = async() => {
        await axios.get('http://localhost:5007/' + 'content')
        .then(res => setData(res.data))
        
        setArticles(data.articles)
        setChecklists(data.checklists)
        setLearningPaths(data.learningPaths)  
      }
  
      fetch("http://localhost:5007/isAdminAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
       })
      .then(res => res.json())
      .then(data => data.isLoggedIn ? navigate("/"): null)

      verifyToken()
      getData().then(setLoading(false))
    }, [])
  
    return(<main className='Home'>
        {!loading ? <div>
          <h1>Choose a Type of Content to Interact with</h1>
          <button className='contentButton' onClick={toArticles}>Articles</button>
          <button className='contentButton' onClick={toChecklists}>Checklists</button>
          <button className='contentButton' onClick={toLearningPaths}>Learning Paths</button>
          <button className='contentButton' onClick={toGames}>Games</button>
        </div>:<span>Loading...</span>}
    </main>)
}