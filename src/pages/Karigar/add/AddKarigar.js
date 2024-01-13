import React, { useEffect, useState } from 'react'
import ContentHeader from '../../../components/contentHeader/ContentHeader'
import Form from '../../../components/form/Form'
import InputField from '../../../components/common/input/InputField'
import ModalComponent from '../../../components/modal/ModalComponent'
import { checkIfAnyFalse, getMessageFromAxiosError, makeRequest, setAllMembersToFalse } from '../../../utils/HelperUtils'
import { useNavigate } from 'react-router'

export default function AddKarigar() {
    const [modal, setModal] = useState(false)
    const [update, setUpdate] = useState(false)
    const navigate = useNavigate()

    const handleModal = () => {
        //console.log(modal)
        setModal(e => !e)
    }
    const [formData, setFormData] = useState({
        id: "",
        karigarName: "",
        description: ""
    })
    const [validator, setValidator] = useState({

        karigarName: false,
        description: false
    })
    const submitData = async () => {
        try {
            const data = { ...validator }
            if (formData.karigarName.length === 0)
                data.karigarName = true;
            if (checkIfAnyFalse(data)) {
                setValidator(data)
                setTimeout(() => {
                    const updatedData = setAllMembersToFalse(validator)
                    setValidator(updatedData)
                }, 5000);
                return;
            }
            let response;
            if (update === false) {

                response = await makeRequest("POST", formData, "/karigar/save")
            }
            else {
                response = await makeRequest("PUT", formData, "/karigar/update")
            }
            //console.log(response)
            alert(response.message)
            navigate(-1)
        } catch (error) {
            alert(getMessageFromAxiosError(error))
        }
    }

    useEffect(() => {
        const karigarData = JSON.parse(localStorage.getItem("update"))
        if (karigarData !== null && karigarData !== undefined) {
            setFormData({
                id: karigarData.id,
                karigarName: karigarData.karigarName,
                description: karigarData.description
            })
            setUpdate(true)
        }
    }, [])


    return (
        <>
            <ContentHeader titleName={"Add Karigar"} buttonName={update ? "Update" : "Submit"} submitData={handleModal} />
            <Form
                title={"Karigar details"}
                children={<>

                    <div style={{ display: 'flex' }}>
                        <InputField labelName={"Karigar Name"} inputValue={formData.karigarName} setInputValue={setFormData} name={"karigarName"} validationText={"Karigar name cannot be empty"} validator={validator.karigarName} />
                        <InputField labelName={"Karigar Description"} inputValue={formData.description} setInputValue={setFormData} name={"description"} />

                    </div>
                    <div style={{ height: "10px" }}></div>
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to add Karigar?"} />
        </>
    )
}
