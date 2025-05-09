import React, { useEffect, useState } from 'react'
import ModalComponent from '../../components/modal/ModalComponent'
import InputField from '../../components/common/input/InputField'
import Form from '../../components/form/Form'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import { getMessageFromAxiosError, makeRequest, validateFields, viewButton, viewOrEditHelper } from '../../utils/HelperUtils'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { showDialog } from '../../store/Actions/MessageDialogAction'

export default function AddCurrency() {
    const [modal, setModal] = useState(false)
    const [update, setUpdate] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [view, setView] = useState(false)

    const handleModal = () => {
        const data = validate()

        const validated = validateFields(data, setValidator, validator)
        if (validated === false)
            return;
        //console.log(modal)
        setModal(e => !e)
    }
    const [formData, setFormData] = useState({
        id: "",
        currencyName: "",
        description: ""
    })
    const [validator, setValidator] = useState({

        currencyName: false,
        description: false
    })
    const validate = () => {
        const data = { ...validator }
        if (formData.currencyName.length === 0)
            data.currencyName = true;
        return data
    }
    const submitData = async () => {
        try {


            let response;
            if (update === false) {

                response = await makeRequest("POST", formData, "/currency/save")
            }
            else {
                response = await makeRequest("PUT", formData, "/karigar/update")
            }
            dispatch(showDialog(true, response.message, false))
        } catch (error) {
            dispatch(showDialog(true, getMessageFromAxiosError(error), true))
        }
        setTimeout(() => {
                dispatch(showDialog(false, "", false))
                navigate(-1)
            }, 3000);
    }

    const viewOrEdit = () => {
        const currency = viewOrEditHelper(setView, setUpdate)
        if (currency !== null && currency !== undefined) {
            setFormData({
                id: currency.id,
                currencyName: currency.currencyName,
                description: currency.description
            })

        }
    }
    useEffect(() => {
        viewOrEdit()
    }, [])


    return (
        <>
            <ContentHeader isView={viewButton()} titleName={"Add Currency"} buttonName={update ? "Update" : "Submit"} submitData={handleModal} />
            <Form
                title={"Currency details"}
                children={<>

                    <div style={{ display: 'flex' }}>
                        <InputField disable={view} labelName={"Currency Name"} inputValue={formData.currencyName} setInputValue={setFormData} name={"currencyName"} validationText={"Currency name cannot be empty"} validator={validator.currencyName} />
                        <InputField disable={view} labelName={"Currency Description"} inputValue={formData.description} setInputValue={setFormData} name={"description"} />

                    </div>
                    <div style={{ height: "10px" }}></div>
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to add Currency?"} />
        </>
    )
}
