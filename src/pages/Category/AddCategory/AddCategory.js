import React, { useEffect, useState } from 'react'
import ContentHeader from '../../../components/contentHeader/ContentHeader'
import { checkIfAnyFalse, downloadReport, getMessageFromAxiosError, makeRequest, setAllMembersToFalse, viewButton, viewOrEditHelper } from '../../../utils/HelperUtils'
import '../../../components/common/CommonInput.css';
import { useNavigate } from 'react-router';
import ModalComponent from '../../../components/modal/ModalComponent';
import Form from '../../../components/form/Form';
import InputField from '../../../components/common/input/InputField';
import SelectComponent from '../../../components/common/Select/SelectComponent';
import { getMetalTypeLOVs } from '../../../common/dropdown/MetalType';
import { useDispatch } from 'react-redux';
import { showDialog } from '../../../store/Actions/MessageDialogAction';
export default function AddCategory() {
    const [option, setOption] = useState([])
    const [modal, setModal] = useState(false)
    const [update, setUpdate] = useState(false)
    const [view, setView] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

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
            dispatch(showDialog(true, response.message, false))
            setTimeout(() => {
                dispatch(showDialog(false, "", false))
                navigate(-1)
            }, 4000);
        } catch (error) {
            dispatch(showDialog(true, getMessageFromAxiosError(error), true))
            setTimeout(() => {
                dispatch(showDialog(false, "", false))
                navigate(-1)
            }, 4000);
        }
    }
    const fetchData = async () => {
        if(option.length > 0) return;
        const metalType = await getMetalTypeLOVs();
        if (metalType !== null) {
            setOption(metalType)
        }
    }

    const viewOrEdit = () => {
        const categoryData = viewOrEditHelper(setView, setUpdate)
        if (categoryData !== null && categoryData !== undefined) {
            setFormData({
                categoryId: categoryData.categoryCode,
                categoryName: categoryData.categoryName,
                metalName: categoryData.metalName
            })

        }
    }

    useEffect(() => {


        viewOrEdit()
        if (option.length === 0)
            fetchData()

    }, [])

    const navigateBack = () => {
        navigate(-1)
    }

    const generateReport = async () => {
        try {
            const response = await makeRequest("GET", null, "/report/detailedcategoryreport/" + formData.categoryId)
            if (response.status === "Success") {
                downloadReport(response, "pdf", "Detailed_Currency_Report")
            }

        } catch (error) {
            console.log(error)
        }
    }



    return (
        <>

            <ContentHeader multiOption={true} isView={viewButton()} titleName={`${view ? 'View' : update ? "Update" : 'Add'} Category`} buttonName={update ? "Update" : "Submit"} submitData={handleModal}
                multiName={viewButton() ?
                    [
                        {
                            name: "Back",
                            method: navigateBack,
                            color: 'red'
                        },
                        {
                            name: "Generate Report",
                            method: handleModal,
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
                    ]}
            />
            <Form
                title={"Category details"}
                children={<>

                    <div style={{ display: 'flex', alignItems: 'center' }}>

                        <SelectComponent disabled={view} validator={validator.metalName} data={formData.metalName} option={option} placeholder={"Please Enter Metal Type"} name={"metalName"} setFormData={setFormData} validationText={"Please Select Metal Type"} />
                        <InputField disable={view} labelName={"Category Name"} inputValue={formData.categoryName} setInputValue={setFormData} name={"categoryName"} validationText={"Category Name cannot be empty"} validator={validator.categoryName} />
                    </div>
                    <div style={{ height: "10px" }}></div>
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={!view ? submitData : generateReport} bodyText={
                !view ? `Are you sure you want to ${update ? "update" : "add"} category?` : 
                `Do you want to generate detailed category Report?`} />

            
        </>
    )
}
