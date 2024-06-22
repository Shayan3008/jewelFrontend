import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import { downloadReport, getMessageFromAxiosError, makeRequest, validateFields, viewButton, viewOrEditHelper } from '../../utils/HelperUtils'
import { useNavigate } from 'react-router'
import Form from '../../components/form/Form'
import InputField from '../../components/common/input/InputField'
import ModalComponent from '../../components/modal/ModalComponent'
import { useDispatch } from 'react-redux'
import { showDialog } from '../../store/Actions/MessageDialogAction'
import { fetchAllVendorHeaders } from '../../common/dropdown/VendorHeader'
import SelectComponent from '../../components/common/Select/SelectComponent'

export default function AddVendor() {
    const [modal, setModal] = useState(false)
    const [update, setUpdate] = useState(false)
    const [view, setView] = useState(false)
    const [vendorHeader, setVendorHeader] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        id: "",
        vendorName: "",
        description: "",
        vendorHeaderId: ""
    })
    const [validator, setValidator] = useState({
        vendorName: false,
        vendorHeaderId: false
    })


    const viewOrEdit = () => {
        const vendorData = viewOrEditHelper(setView, setUpdate)
        if (vendorData !== null && vendorData !== undefined) {
            setFormData({
                vendorName: vendorData.vendorName,
                id: vendorData.id,
                description: "This is vendor " + vendorData.vendorName,
                vendorHeaderId:vendorData.vendorHeaderId
            })

        }
    }
    const validate = () => {
        const data = { ...validator }
        if (formData.vendorName.length === 0)
            data.vendorName = true;
        if (formData.vendorHeaderId.length === 0)
            data.vendorHeaderId = true
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

            response = await makeRequest("POST", formData, "/vendor/save")
            console.log(response)
            //console.log(response)
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

    const fetchData = async () => {
        try {
            const response = await fetchAllVendorHeaders()
            if (response !== null) {
                setVendorHeader(response)
            }
        } catch (error) {
            alert(getMessageFromAxiosError(error))
        }
    }

    useEffect(() => {
        viewOrEdit()
        fetchData()
    }, [])

    const generateReport = async () => {
        try {
            if (view === false) return
            const response = await makeRequest("GET", null, "/report/currencyreportpdf?filter=vendorId=" + formData.id)
            if (response.status === "Success") {
                downloadReport(response, "pdf", "Ledger_Transaction_" + formData.vendorName)
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <ContentHeader isView={viewButton()} multiOption={true} titleName={"Add Vendor"} buttonName={update ? "Update" : "Submit"} submitData={handleModal} multiName={viewButton() ?
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
                title={"Vendor Details"}
                children={

                    <div style={{ display: 'flex' }}>
                        <InputField disable={view} labelName={"Vendor Name"} inputValue={formData.vendorName} setInputValue={setFormData} name={"vendorName"} validationText={"Vendor name cannot be empty"} validator={validator.vendorName} />
                        <InputField disable={view} labelName={"Vendor Description"} inputValue={formData.description} setInputValue={setFormData} name={"description"} />
                        <SelectComponent disabled={view} data={formData.vendorHeaderId} name={"vendorHeaderId"} option={vendorHeader} setFormData={setFormData} placeholder={"Select Vendor Header:"}
                            validator={validator.vendorHeaderId} validationText={"Vendor Header must be selected."} />
                    </div>
                }
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to add Vendor?"} />


        </>
    )
}
