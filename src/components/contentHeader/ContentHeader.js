import React from 'react'
import Button from '../button/Button'
import './ContentHeader.css'
export default function ContentHeader(props) {
    return (
        <div className='contentHeader'>

            <p className='contentHeading' style={{ fontFamily: 'Fjalla_One,sarif', margin: 0 }}>{props.titleName}</p>
            <div>

                <Button content={<p style={{
                    fontSize: '1rem',
                    color: 'white',
                    fontWeight: 'bold',
                    margin: 0
                }}>{props.buttonName}</p>} method={() => {
                    localStorage.removeItem("update") 
                    props.submitData()
                }} />
            </div>
        </div>
    )
}
