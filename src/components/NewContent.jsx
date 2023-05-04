import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { TextField, Typography } from "@mui/material"
import { alpha, styled } from '@mui/material/styles';
import axios from "axios";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function NewContent({current, deleteItem, itemKey}) {
    const [index, setIndex] = React.useState(current.index)
    const [content, setContent] = React.useState(current)
    const [loading, setLoading] = React.useState(true)

    //for text section
    const [header, setHeader] = React.useState(current.header || '')
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty())
    //for images
    const [link, setLink] = React.useState('') 
    const [caption, setCaption] = React.useState(current.caption || '')

    const deleteContent = () => {
        deleteItem(content)
    }

    const updateContent = editorData =>
    {
        
        let temp = content
        temp.raw = JSON.stringify(convertToRaw(editorData.getCurrentContent()))
        console.log(temp.raw)
        setContent(temp)
    }

    const onChange = (editorState) => {
        setEditorState(editorState)

        updateContent(editorState)
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
                <Editor
                wrapperClassName="rich-editor demo-wrapper"
                editorClassName="text-editor"
                editorState={editorState}
                onEditorStateChange={onChange}
                placeholder="Type paragraph..." 
                />
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