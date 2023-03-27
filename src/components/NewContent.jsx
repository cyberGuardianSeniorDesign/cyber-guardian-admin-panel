import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { TextField, Typography } from "@mui/material"
import { alpha, styled } from '@mui/material/styles';
import axios from "axios";


export default function NewContent({current, deleteItem, itemKey}) {
    const [index, setIndex] = React.useState(current.index)
    const [content, setContent] = React.useState(current)
    const [loading, setLoading] = React.useState(true)

    //for text section
    const [header, setHeader] = React.useState(current.header || '')

    //for images
    const [link, setLink] = React.useState('') 
    const [caption, setCaption] = React.useState(current.caption || '')

    const deleteContent = () => {
        console.log(content)
        deleteItem(content)
    }

    const updateContent = e =>
    {
        let temp = content
        temp.text = e.target.value
        setContent(temp)
    }

    const updateCaption = e => {
        let temp = content
        temp.caption = e.target.value
        setContent(temp)
    }

    const updateHeader = e => {
        let temp = content
        temp.header = e.target.value
        setContent(temp)
    }

    useEffect(() => {
        const loadContent = async() => {

            if(content == undefined || null){
                setTimeout(loadContent, 500)
            } else if(content.contentType == 'image') {
                let ab = await current.file.arrayBuffer()
                let arr = new Uint8Array(ab)
                const str = arr.reduce((data, byte) => {
                    return data + String.fromCharCode(byte)
                }, '')
                let base64 = window.btoa(str)
                setLink(`data:image;base64, ${base64}`)
                setLoading(false)
            }
            else{
                setLoading(false)
            }
        }
       
        loadContent()
    }, [])
    
    return <div >
        {!loading ?
        <div className="content">
            {content.contentType == "text" ?
            <div className="text-div">
            <TextField onChange={updateHeader} placeholder='Header (Optional)' defaultValue={content.header} multiline sx={{width: '80vw', margin: '1em .5em'}}/>
            <TextField onChange={updateContent} defaultValue={content.text} rows={10} multiline sx={{width: '80vw'}}/>
            <button className='content-delete-btn' onClick={deleteContent}>Delete</button>
            </div>:
            <div className='image-content-div'>
                {link ? <img className='content-img' src={link} alt=""/>: null}
                <TextField onChange={updateCaption} placeholder='Caption (Optional)' defaultValue={content.caption} multiline sx={{width: '80vw', margin: '1em .5em'}}/>
                <button className='content-delete-btn' onClick={deleteContent}>Delete</button>
            </div>
            }
        </div>: null}
    </div>
}