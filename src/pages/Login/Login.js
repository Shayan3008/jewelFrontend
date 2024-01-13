import React, { useEffect, useState } from 'react'
import './Login.css'
import InputField from '../../components/common/input/InputField'
import Button from 'react-bootstrap/Button'
import logo from "../../assets/images/Real.png"
import { Link, useNavigate } from 'react-router-dom'
import { makeRequest, getMessageFromAxiosError } from '../../utils/HelperUtils'
import { Spinner } from 'react-bootstrap'

export default function Login(props) {
  const [formData, setFormData] = useState({
    "userName": "",
    "password": "",
    "email": ""
  })

  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()
  const loginUser = async () => {
    try {
      setLoader(true)
      // //console.log(formData)
      const response = await makeRequest("POST", formData, "/auth/login")
      //console.log(response)
      if (response.statusCode === 200) {
        localStorage.setItem("token", 
          response.body.token
        );
        localStorage.setItem("name",response.body.userName)
      }
      setLoader(false)
      props.setShowNavBar(true)
      navigate("/home")      
    } catch (error) {
      //console.log(getMessageFromAxiosError(error))
      setLoader(false)
    }
  }

  useEffect(() => {
    props.setShowNavBar(false)
  }, [props])

  return (
    <div className='mainPage'>
      <div className='loginForm'>
        <div style={{ height: "50%", width: "100%", textAlign: 'center', background: '#FFF5F5' }}>

          <img src={logo} alt="" style={{ height: '40vh', width: '60%' }} />
        </div>
        <div style={{ height: '20px' }}></div>
        <div>

          <InputField labelName={"Email"} inputValue={formData.email} setInputValue={setFormData} name={"email"} />
        </div>
        <div style={{ height: '10px' }}></div>
        <div>

          <InputField labelName={"Password"} inputValue={formData.password} setInputValue={setFormData} name={"password"} />
        </div>

        <div style={{ height: '5px' }}></div>
        <div style={{ width: '100%', textAlign: 'center' }}>

          <Button variant="success" style={{ width: "50%", fontFamily: "Arvo", fontSize: '20px' }} onClick={loader ? null : loginUser}>
            {loader ? <Spinner /> : "Login"}
          </Button>
        </div>
        <div style={{ height: '5px' }}></div>
        <div className='text-center w-100'>

          <Link to={'/register'} > Dont have account? register</Link>
        </div>
        <div style={{ height: '5px' }}></div>
      </div>
    </div>
  )
}
