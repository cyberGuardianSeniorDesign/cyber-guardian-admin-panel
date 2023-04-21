import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { TextField, Typography } from "@mui/material"
import { alpha, styled } from '@mui/material/styles';
import axios from "axios";
import { EditorState, convertToRaw, convertFromRaw, ContentState  } from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { editableInputTypes } from "@testing-library/user-event/dist/utils";
import convertFromRawToDraftState from "draft-js/lib/convertFromRawToDraftState";

const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
export default function Content({dbContent, deleteItem, itemKey}) {
    const [index, setIndex] = React.useState(dbContent.index)
    const [content, setContent] = React.useState(dbContent)
    const [loading, setLoading] = React.useState(true)

    //for text section
    const [header, setHeader] = React.useState(dbContent.header || '')
    const [editorState, setEditorState] = React.useState()

    //for images
    const [link, setLink] = React.useState('') 
    const [caption, setCaption] = React.useState(dbContent.caption || '')
    

    const deleteContent = () => {
        deleteItem(content)
    }

    const updateContent = editorData =>
    {
        let temp = content
        temp.raw = JSON.stringify(convertToRaw(editorData.getCurrentContent()))
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
                setTimeout(loadContent, 3000)
            } else if(content.contentType == 'image') {
                await axios.get(process.env.REACT_APP_BACKEND + 'file/' + dbContent.text)
                .then(res => {
                    setLink("https://storage.googleapis.com/cyber-guardian-images/" + dbContent.text)
                    setLoading(false)
                })
                .catch(() =>{
                    setTimeout(loadContent, 1000)
                }

                )
                //setBase64(baseStr)
                 
            } else if(content.contentType == 'text')
            {
                setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(dbContent.raw))))
            }
            
                setLoading(false)
            
        }
       
        loadContent()
    }, [])
    
    return <div className="content">
        {!loading ?
        <div className="content">
            {console.log(dbContent)}
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