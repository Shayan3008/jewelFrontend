import React, { useEffect, useState } from 'react'
import ContentHeader from '../../../components/contentHeader/ContentHeader'
import { checkIfAnyFalse, getMessageFromAxiosError, makeRequest, setAllMembersToFalse } from '../../../utils/HelperUtils'
import Select from 'react-dropdown-select';
import '../../../components/common/CommonInput.css';
import { useNavigate } from 'react-router';
import ModalComponent from '../../../components/modal/ModalComponent';
import Form from '../../../components/form/Form';
import InputField from '../../../components/common/input/InputField';
import SelectComponent from '../../../components/common/Select/SelectComponent';
export default function AddCategory() {
    const [option, setOption] = useState([])
    const [modal, setModal] = useState(false)
    const [update, setUpdate] = useState(false)
    const navigate = useNavigate()

    const handleModal = () => {
        //console.log(modal)
        setModal(e => !e)
    }

    const [formData, setFormData] = useState({
        categoryId: "",
        metalName: "",
        categoryName: "",
    })

    const [validator, setValidator] = useState({
        metalName: false,
        categoryName: false
    })
    const submitData = async () => {
        try {
            const data = { ...validator }
            if (formData.categoryName.length === 0)
                data.categoryName = true
            if (formData.metalName.length === 0)
                data.metalName = true
            if (checkIfAnyFalse(data)) {
                console.log(data)
                setValidator(data)
                setTimeout(() => {
                    const data = setAllMembersToFalse(formData)
                    setValidator(data)
                }, 5000);
                return;
            }


            let response;
            if (update === false) {

                response = await makeRequest("POST", formData, "/category/save")
            }
            else {
                response = await makeRequest("PUT", formData, "/category/update")
            }
            alert(response.message)
            navigate(-1)
        } catch (error) {
            alert(getMessageFromAxiosError(error))
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            //console.log("Hello")
            const response = await makeRequest("GET", null, "/metalType")
            //console.log(response.body.length)
            if (response.statusCode === 200) {
                const metalOptions = []
                for (const element of response.body) {
                    //console.log(response.body)
                    const data = {}
                    data.id = element.metalName;
                    data.name = element.metalName
                    metalOptions.push(data)
                }
                setOption(metalOptions)
                //console.log(option)
            }
        }
        const categoryData = JSON.parse(localStorage.getItem("update"))
        if (categoryData !== null && categoryData !== undefined) {
            setFormData({
                categoryId: categoryData.categoryId,
                categoryName: categoryData.categoryName,
                metalName: categoryData.metalName
            })
            setUpdate(true)
        }
        fetchData()

    }, [])



    return (
        <>

            <ContentHeader titleName={"Add Category"} buttonName={update ? "Update" : "Submit"} submitData={handleModal} />
            <Form
                title={"Category details"}
                children={<>

                    <div style={{ display: 'flex', alignItems: 'center' }}>

                        <SelectComponent validator={validator.metalName} data={formData.metalName} option={option} placeholder={"Please Enter Metal Type"} name={"metalName"} setFormData={setFormData} validationText={"Please Select Metal Type"} />
                        <InputField labelName={"Category Name"} inputValue={formData.categoryName} setInputValue={setFormData} name={"categoryName"} validationText={"Category Name cannot be empty"} validator={validator.categoryName} />
                    </div>
                    <div style={{ height: "10px" }}></div>
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={`Are you sure you want to ${update ? "update" : "add"} category?`} />
        </>
    )
}
