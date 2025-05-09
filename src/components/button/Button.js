import React from 'react'
import './Button.css'
export default function Button(props) {
    return (
        <button className='button' style={{ background: '#25B491', border: 'none', cursor: 'pointer', height: '35px', borderRadius: '5px' }} onClick={props.method}
        onKeyDown={(e)=>{
            console.log(e)
            if(e.key === "Enter")
                console.log(e)
        }} >
            {props.content}
        </button>
    )
}
