import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { TextField, Typography } from "@mui/material"
import { alpha, styled } from '@mui/material/styles';
import axios from "axios";


export default function Content({dbContent, deleteItem}) {
    const [index, setIndex] = React.useState(dbContent.index)
    const [content, setContent] = React.useState(dbContent)
    const [loading, setLoading] = React.useState(true)
    const [link, setLink] = React.useState('')

    const deleteContent = () => {
        deleteItem(index)
    }

    const updateContent = e =>
    {
        let temp = content
        temp.text = e.target.value
        setContent(temp)
    }
    useEffect(() => {
        const loadContent = async() => {

            if(content == undefined || null){
                setTimeout(loadContent, 500)
            } else if(content.contentType == 'image') {
                await axios.get('http://localhost:5007/' + 'file/' + dbContent.text)
                .then(res => setLink("https://storage.googleapis.com/cyber-guardian-images/" + dbContent.text))
                .catch(() =>{
                    setTimeout(loadContent, 1000)
                }

                )
                //setBase64(baseStr)
                setLoading(false)
            }
            else{
                setLoading(false)
            }
        }
       
        loadContent()
    }, [])
    
    return <div className="content">
        {!loading ?
        <div className="content">
            {content.contentType == "text" ?
            <div className="text-div">
            <TextField onChange={updateContent} defaultValue={content.text} rows={10} multiline sx={{width: '60vw'}}/>
            <button className='content-delete-btn' onClick={deleteContent}>Delete</button>
            </div>:
            <div className='image-content-div'>
                {link ? <img className='content-img' src={link} alt=""/>: null}
                <button className='content-delete-btn' onClick={deleteContent}>Delete</button>
            </div>
            }
        </div>: null}
    </div>
}