import React, { useState } from 'react'
import { FaAngleDown, FaAngleRight } from 'react-icons/fa'

export default function Form({ title, children }) {
    const [display, setDisplay] = useState("auto")

    return (
        <>

            <div className='formHeader' style={{ display: 'flex', background: '#A5CAD9', alignItems: 'center', justifyContent: 'space-between' }}>

                <h5 style={{
                    margin: 0,
                    padding: '0.4rem'
                }}>{title}</h5>
                <div>
                    {display === "0" ? <FaAngleDown size={25} color='white' onClick={() => {
                        setDisplay("auto")
                    }} /> : <FaAngleRight size={25} color='white' onClick={() => {
                        setDisplay("0")
                    }} />}
                </div>


            </div>
            <div className='formField' style={display === "0" ? { height: display, overflow: 'hidden', transition: 'all 1s ease' } : { height: display, overflow: 'visible', transition: 'all 1s ease' }}>
                <div style={{ height: "10px" }}></div>
                {children}
            </div>
        </>
    )
}
