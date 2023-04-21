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
import Modal from '@mui/material/Modal'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Articles(){
    const navigate = useNavigate()
    const [articles, setArticles] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false)
    const [openSuccess, setOpenSuccess] = React.useState(false)
    const [successMsg, setSuccessMsg] = React.useState('')
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), [])
    const [focusedArticle, setFocusedArticle] = React.useState('')

    const handleEditArticle = (article) => {
        navigate('edit/' + article._id, {state: {article: article}})
    }

    const handleViewArticle = (article) => {
        navigate('view/' + article._id, {state: {article: article}})
    }

    const handleCreateArticle = () => {
        navigate('create')
    }

    const handleClose = () => {
        setOpenDeleteConfirmation(false)
    }

    const handleCloseSuccess = () => {
        setOpenSuccess(false)
    }

    const deleteArticle = async(id) => {
        console.log(process.env.REACT_APP_BACKEND + 'articles/' + id)
        await axios.delete(process.env.REACT_APP_BACKEND + 'articles/' + id)
        .then(() => console.log("Article Deleted"))
        
        let temp = articles

        for(let i = 0; i < temp.length; i++){
            if(temp[i]._id == id){
                temp.splice(i, 1)
            }
        }

        setArticles(temp)
        forceUpdate()
    }

    React.useEffect(() => {
        const verifyToken = async() => {
            fetch(process.env.REACT_APP_BACKEND + "isAdminAuth", {
              headers: {
                "x-access-token": localStorage.getItem("token")
              }
            })
            .then(res => res.json())
            .then(data => data.isLoggedIn ? navigate('/articles'):navigate('/login'))
        }

        const fetchArticles = async() => {
            await fetch(process.env.REACT_APP_BACKEND + 'articles')
            .then(res => res.json())
            .then(articles => setArticles(articles))
        }

        verifyToken()
        fetchArticles()
        setLoading(false)
    }, [])

    return(<main >
        {!loading ? 
        <div className='articles-page'>
            <h1 className="home-h1">ARTICLES</h1>
            <button className='create-btn' onClick={handleCreateArticle}>Create New Article</button>
            {articles.length > 0 ? 
            
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
                <TableBody>
                {articles.map(article => {
                    return <TableRow key={article._id} className='article-card'>
                        <TableCell>{article.title}</TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>{article.level}</TableCell>
                        <TableCell className="content-options">
                            <Tooltip title='View'>
                                <IconButton onClick={() => handleViewArticle(article)}>
                                    <VisibilityIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Edit'>
                                <IconButton onClick={e=>handleEditArticle(article)}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                                <IconButton onClick={() => {
                                    setFocusedArticle(article._id)
                                    setOpenDeleteConfirmation(true)
                                }}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                })} 
                </TableBody>
                </Table>
                </TableContainer>: <p className='no-data-text'>No Articles in Database.</p>
            }
            <Modal
                open={openDeleteConfirmation}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <div className="modal">
                    <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="600">
                     Delete Confirmation
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '20px', margin: '1em 2em' }}>
                    Are you sure you want to delete this article? 
                    </Typography>
                    <div>
                        <button className="dark-btn" onClick={() => {
                            deleteArticle(focusedArticle)
                            setSuccessMsg("Article was Deleted")
                            setOpenSuccess(true)
                            handleClose()
                            }}>Yes</button>
                        <button className="dark-btn" onClick={handleClose}>No</button>
                    </div>
                </div>
            </Modal>
            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    {successMsg}
                </Alert>
            </Snackbar>
        </div>:<span>Loading...</span>}
    </main>)
}