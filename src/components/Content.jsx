import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { TextField, Typography } from "@mui/material"
import { alpha, styled } from '@mui/material/styles';


export default function Content({dbContent, deleteItem}) {
    const [index, setIndex] = React.useState(dbContent.index)
    const [content, setContent] = React.useState(dbContent)
    const [loading, setLoading] = React.useState(true)
    const [base64, setBase64] = React.useState(null)

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
        const loadContent = () => {

            if(content == undefined || null){
                setTimeout(loadContent, 500)
            } else if(content.contentType == 'image') {
                let baseStr = Buffer.from(dbContent.buffer).toString('base64');
                setBase64(baseStr)
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
                {base64 ? <img className='content-img' src={`data:image/png;base64,${base64}`} alt=""/>: null}
                <button className='content-delete-btn' onClick={deleteContent}>Delete</button>
            </div>
            }
        </div>: null}
    </div>
}