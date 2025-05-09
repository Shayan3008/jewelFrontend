import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import InputField from '../../components/common/input/InputField'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import Form from '../../components/form/Form'
import ModalComponent from '../../components/modal/ModalComponent'
import { showDialog } from '../../store/Actions/MessageDialogAction'
import { checkIfAnyFalse, getMessageFromAxiosError, makeRequest, setAllMembersToFalse } from '../../utils/HelperUtils'

export default function AddStartingBalanceForNewDate() {
    const [modal, setModal] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleModal = () => {
        setModal(e => !e)
    }
    const [formData, setFormData] = useState({

        amount: 0,
        trnDate: ""

    })
    const [validator, setValidator] = useState({

        metalName: false,
        description: false
    })
    const submitData = async () => {
        try {
            let response;


            response = await makeRequest("POST", formData, "/cashbook/addOpeningBalance")



            dispatch(showDialog(true, response.message, false))
        } catch (error) {
            dispatch(showDialog(true, getMessageFromAxiosError(error), true))
        }
        setTimeout(() => {
            dispatch(showDialog(false, "", false))
            navigate(-1)
        }, 3000);
    }



    return (
        <>
            <ContentHeader titleName={`${"Add"} Opening Balance`} buttonName={"Submit"} submitData={handleModal} />
            <Form
                title={"Add Cash Book Opening Balance"}
                children={<>

                    <div style={{ display: 'flex' }}>
                        <InputField labelName={"Opening Balance"} inputValue={formData.amount} setInputValue={setFormData} name={"amount"} />
                        <InputField labelName={"Date"} inputValue={formData.trnDate} setInputValue={setFormData} name={"trnDate"} type={"date"} />
                    </div>
                    <div style={{ height: "10px" }}></div>
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={`Are you sure you want to Insert opening balance on date : ${formData.trnDate.toString()}?`} />
        </>
    )
}
