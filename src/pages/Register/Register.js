import React, { useEffect, useState } from 'react'
import '../Login/Login.css'
import InputField from '../../components/common/input/InputField'
import Button from 'react-bootstrap/Button'
import logo from "../../assets/images/Real.png"
import { Link } from 'react-router-dom'

export default function Register(props) {
    const [formData, setFormData] = useState({
        "userName": "",
        "password": "",
        "email": ""
    })

    useEffect(() => {
        props.setShowNavBar(false)
    }, [props])

    return (
        <div className='mainPage'>
            <div className='loginForm'>
                <div style={{ textAlign: 'center', background: '#d3d7da' }}>

                    <img src={logo} alt="" style={{ height: '40vh', width: '60%' }} />
                </div>
                <div style={{ height: '20px' }}></div>

                <InputField labelName={"User Name"} inputValue={formData.userName} setInputValue={setFormData} name={"userName"} />
                <div style={{ height: '5px' }}></div>
                <InputField labelName={"Email"} inputValue={formData.email} setInputValue={setFormData} name={"email"} />


                <div style={{ height: '5px' }}></div>
                <div>

                    <InputField labelName={"Password"} inputValue={formData.password} setInputValue={setFormData} name={"password"} />
                </div>

                <div style={{ height: '5px' }}></div>
                <div style={{ width: '100%', textAlign: 'center' }}>

                    <Button variant="success" style={{ width: "50%", fontFamily: "Arvo", fontSize: '20px' }} onClick={async () => {

                    }}>
                        Register
                    </Button>
                </div>
                <div style={{ height: '5px' }}></div>
                <div className='text-center w-100'>

                    <Link to={'/login'} >Already have an account? login</Link>
                </div>
                <div style={{ height: '5px' }}></div>
            </div>
        </div>
    )
}
