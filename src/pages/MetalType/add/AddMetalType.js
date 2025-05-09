import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { checkIfAnyFalse, getMessageFromAxiosError, makeRequest, setAllMembersToFalse, viewButton, viewOrEditHelper } from '../../../utils/HelperUtils'
import { showDialog } from '../../../store/Actions/MessageDialogAction'
import ContentHeader from '../../../components/contentHeader/ContentHeader'
import Form from '../../../components/form/Form'
import InputField from '../../../components/common/input/InputField'
import ModalComponent from '../../../components/modal/ModalComponent'

export default function AddMetalType() {
    const [modal, setModal] = useState(false)
    const [update, setUpdate] = useState(false)
    const [view, setView] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleModal = () => {
        setModal(e => !e)
    }
    const [formData, setFormData] = useState({
        id: "",
        metalName: "",
        description: ""
    })
    const [validator, setValidator] = useState({

        metalName: false,
        description: false
    })
    const submitData = async () => {
        try {
            const data = { ...validator }
            if (formData.metalName.length === 0)
                data.metalName = true;
            if (checkIfAnyFalse(data)) {
                setValidator(data)
                setTimeout(() => {
                    const updatedData = setAllMembersToFalse(validator)
                    setValidator(updatedData)
                }, 5000);
                return;
            }
            let response;


            response = await makeRequest("POST", formData, "/metalType/save")



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
        let metalTypeData = viewOrEditHelper(setView, setUpdate)
        if (metalTypeData !== null && metalTypeData !== undefined) {
            setFormData({
                id: metalTypeData.id,
                metalName: metalTypeData.metalName,
                description: metalTypeData.description
            })

        }
    }

    useEffect(() => {
        viewOrEdit()
    }, [])


    return (
        <>
            <ContentHeader isView={viewButton()} titleName={`${update ? "Update" : "Add"} Metal Type`} buttonName={update ? "Update" : "Submit"} submitData={handleModal} />
            <Form
                title={"Metal Name Details"}
                children={<>

                    <div style={{ display: 'flex' }}>
                        <InputField disable={view} labelName={"Metal Name"} inputValue={formData.metalName} setInputValue={setFormData} name={"metalName"} validationText={"Metal name cannot be empty"} validator={validator.metalName} />
                        <InputField disable={view} labelName={"Metal Name Description"} inputValue={formData.description} setInputValue={setFormData} name={"description"} />

                    </div>
                    <div style={{ height: "10px" }}></div>
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={`Are you sure you want to ${update ? "Update" : "Add"} Metal Type?`} />
        </>
    )
}
