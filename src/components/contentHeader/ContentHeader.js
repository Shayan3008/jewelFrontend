import React from 'react'
import Button from '../button/Button'
import './ContentHeader.css'
import { viewButton } from '../../utils/HelperUtils';
export default function ContentHeader(props) {
    const multiButtonDesign = () => {
        // if (viewButton() === true)
        //     return <></>;
        if (props.isView) {
            if (props.multiOption === true) {
                return <div style={{
                    display: 'flex'
                }}>{
                        props.multiName.map(e => <> <div>
                            <Button color={e.color} content={<p style={{
                                fontSize: '1rem',
                                color: 'white',
                                fontWeight: 'bold',
                                margin: 0
                            }}>{e.name}</p>} method={() => {
                                e.method()
                            }} />
                        </div>
                            <div style={{ width: '10px' }}></div>
                        </>)
                    }</div>
            }
            return <></>
        }
        if (props.multiOption === true) {
            return <div style={{
                display: 'flex'
            }}>{
                    props.multiName.map(e => <> <div>
                        <Button color={e.color} content={<p style={{
                            fontSize: '1rem',
                            color: 'white',
                            fontWeight: 'bold',
                            margin: 0
                        }}>{e.name}</p>} method={() => {
                            e.method()
                        }} />
                    </div>
                        <div style={{ width: '10px' }}></div>
                    </>)
                }</div>
        }
        return <div>

            <Button content={<p style={{
                fontSize: '1rem',
                color: 'white',
                fontWeight: 'bold',
                margin: 0
            }}>{props.buttonName}</p>} method={() => {
                localStorage.removeItem("update")
                localStorage.removeItem("view")
                props.submitData()
            }} />
        </div>


    }
    return (
        <div className='contentHeader'>

            <p className='contentHeading' style={{ fontFamily: 'Fjalla_One,sarif', margin: 0 }}>{props.titleName}</p>

            {multiButtonDesign()}
        </div>
    )
}
