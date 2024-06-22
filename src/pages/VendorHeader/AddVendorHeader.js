import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { getMessageFromAxiosError, makeRequest, validateFields, viewButton, viewOrEditHelper } from '../../utils/HelperUtils'
import { showDialog } from '../../store/Actions/MessageDialogAction'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import Form from '../../components/form/Form'
import InputField from '../../components/common/input/InputField'
import ModalComponent from '../../components/modal/ModalComponent'

export default function AddVendorHeader() {
    const [modal, setModal] = useState(false)
    const [update, setUpdate] = useState(false)
    const [view, setView] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: ""
    })
    const [validator, setValidator] = useState({

        name: false,
    })

    const viewOrEdit = () => {
        const vendorHeaderData = viewOrEditHelper(setView, setUpdate)
        if (vendorHeaderData !== null && vendorHeaderData !== undefined) {
            setFormData({
                name: vendorHeaderData.name,
                id: vendorHeaderData.id,
                description: vendorHeaderData.description
            })

        }
    }
    const validate = () => {
        const data = { ...validator }
        if (formData.name.length === 0)
            data.vendorName = true;
        return data
    }

    const handleModal = () => {

        localStorage.removeItem("update")
        localStorage.removeItem("view")
        const data = validate()
        const validated = validateFields(data, setValidator, validator)
        if (validated === false)
            return;

        setModal(e => !e)
    }

    const submitData = async () => {
        try {

            let response;

            response = await makeRequest("POST", formData, "/vendor-header/save")
            
            dispatch(showDialog(true, response.message, false))
        } catch (error) {
            console.log(error)
            dispatch(true, showDialog(getMessageFromAxiosError(error), true))
        }
        setTimeout(() => {
            dispatch(showDialog(false, "", false))
            navigate(-1)
        }, 3000);
    }

    const navigateBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        viewOrEdit()
    }, [])

    const generateReport = ()=>{
        console.log("Report Generated")
    }

    return (
        <>
            <ContentHeader isView={viewButton()} multiOption={true} titleName={"Add Vendor Header"} buttonName={update ? "Update" : "Submit"} submitData={handleModal} multiName={viewButton() ?
                [
                    {
                        name: "Back",
                        method: navigateBack,
                        color: 'red'
                    },
                    {
                        name: "Generate Report",
                        method: generateReport,
                        color: ""
                    }
                ] : [
                    {
                        name: "Back",
                        method: navigateBack,
                        color: 'red'
                    },
                    {
                        name: update ? "Update" : "Submit",
                        method: handleModal,
                        color: '#25B491'
                    }
                ]
            } />
            <Form
                title={"Vendor Header Details"}
                children={

                    <div style={{ display: 'flex' }}>
                        <InputField disable={view} labelName={"Vendor Header Name"} inputValue={formData.name} setInputValue={setFormData} name={"name"} validationText={"Vendor Header name cannot be empty"} validator={validator.vendorName} />
                        <InputField disable={view} labelName={"Vendor Header Description"} inputValue={formData.description} setInputValue={setFormData} name={"description"} />

                    </div>
                }
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to add Vendor Header ?"} />


        </>
    )
}
