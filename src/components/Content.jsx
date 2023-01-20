import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { TextField, Typography } from "@mui/material"

export default function Content({dbContent, deleteItem}) {
    const [index, setIndex] = React.useState(dbContent.index)
    const [content, setContent] = React.useState(dbContent)
    const [loading, setLoading] = React.useState(true)
    const [base64, setBase64] = React.useState(null)

    const renderImage = () => {
        let baseStr = Buffer.from(dbContent.buffer).toString('base64');
        console.log('render image')
        setBase64(baseStr)
    }

    const deleteContent = () => {
        deleteItem(index)
    }

    useEffect(() => {
        const loadContent = () => {

            if(content == undefined || null){
                setTimeout(loadContent, 500)
            } else if(content.contentType == 'image') {
                let baseStr = Buffer.from(dbContent.buffer).toString('base64');
                console.log('render image')
                setBase64(baseStr)
                setLoading(false)
            }
            else{
                setLoading(false)
            }
        }
       
        loadContent()
    }, [])
    
    return <div>
        {console.log(dbContent)}
        {!loading ?
        <div>
            <button onClick={deleteContent}>Delete</button>
            {content.contentType == "text" ?
            <TextField defaultValue={content.text} rows={20} multiline />:
            
            <div className='image-content-div'>
                {base64 ? <img className='content-img' src={`data:image/png;base64,${base64}`} alt=""/>: null}
            </div>
            }
        </div>: null}
    </div>
}