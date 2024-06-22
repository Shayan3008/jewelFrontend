import React, { useState } from 'react'
import SelectComponent from '../../components/common/Select/SelectComponent'
import InputField from '../../components/common/input/InputField'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import Form from '../../components/form/Form'
import ModalComponent from '../../components/modal/ModalComponent'
import { convertDateToCorrectFormat, downloadReport, getFilterKey, makeRequest, validateFields } from '../../utils/HelperUtils'
import { trnType } from '../../constants/constantData'

export default function CurrencyTransactionReport() {
    const [modal, setModal] = useState(false)

    const [formData, setFormData] = useState({
        trnType: "",
        trnDateLess: "",
        trnDateGreater: "",
    })

    const [validator, setValidator] = useState({
        trnDate: false
    })
    const handleModal = () => {
        const data = validate()
        const validated = validateFields(data, setValidator, validator)
        if (validated === false)
            return;
        setModal(e => !e);
    }

    const validate = () => {
        const data = { ...validator }
        if (formData.trnDateLess.length === 0 && formData.trnDateGreater.length > 0)
            data.trnDate = true;
        return data
    }

    const generateReport = async (result) => {
        try {
            const response = await makeRequest("GET", null, "/report/cashbookreportpdf?filter=" + result)
            if (response.status === "Success") {
                downloadReport(response, "pdf", "CASHBOOK_" + new Date().toUTCString())
            }

        } catch (error) {
            console.log(error)
        }
    }
    const submitData = async () => {
        const dateLess = convertDateToCorrectFormat(formData.trnDateLess)
        const trnDateGreater = convertDateToCorrectFormat(formData.trnDateGreater)
        const data1 = { ...formData }
        data1.trnDateLess = dateLess
        data1.trnDateGreater = trnDateGreater

        const result = getFilterKey(data1)

        await generateReport(result)
    }
    return (
        <>
            <ContentHeader titleName={"Cash Book Report"} buttonName={"Generate Report"} submitData={handleModal} />
            <Form
                title={"Cash Book Filters"}
                children={<>

                    <div style={{ display: 'flex' }}>
                        <SelectComponent data={formData.trnType} option={trnType} name={"trnType"} setFormData={setFormData} placeholder={"Select Transaction Type"} />
                        <InputField labelName={"Transaction Start date"} inputValue={formData.trnDateLess} setInputValue={setFormData} name={"trnDateLess"} type={"date"} validator={validator.trnDate} validationText={"Start Date Cannot be empty?"} />
                        <InputField labelName={"Transaction End date"} inputValue={formData.trnDateGreater} setInputValue={setFormData} name={"trnDateGreater"} type={"date"} />

                    </div>
                    <div style={{ height: "10px" }}></div>
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want generate report?"} />
            
        </>
    )
}
