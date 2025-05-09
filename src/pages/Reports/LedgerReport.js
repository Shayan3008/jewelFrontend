import React, { useCallback, useEffect, useState } from 'react'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import Form from '../../components/form/Form'
import SelectComponent from '../../components/common/Select/SelectComponent'
import ModalComponent from '../../components/modal/ModalComponent'
import { fetchAllVendorHeaders } from '../../common/dropdown/VendorHeader'
import { downloadReport, getFilterKey, getMessageFromAxiosError, makeRequest } from '../../utils/HelperUtils'

export default function LedgerReport() {

    const [vendor, setVendor] = useState([])
    const [vendorHeader, setVendorHeader] = useState([])
    const [modal, setModal] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        vendorId: ""
    })


    const fetchData = async () => {
        const request = await fetchAllVendorHeaders()
        if (request !== null) {
            setVendorHeader(request)
        }
    }

    const fetchVendor = useCallback(async () => {
        const request = await makeRequest("GET", null, "/vendor/getvendorbyvendorheader/" + formData.name);
        try {
            let data = []
            for (let i in request.body) {
                let data2 = {}
                data2.id = request.body[i].id
                data2.name = request.body[i].vendorName
                data.push(data2)
            }
            setVendor(data)
        } catch (error) {
            alert(getMessageFromAxiosError(error))

        }

    }, [formData])

    useEffect(() => {
        fetchData()
        if (formData.name !== null && formData.name !== "") {
            fetchVendor()
        }
    }, [formData.name, fetchVendor])

    const handleModal = () => {
        setModal(e => !e)
    }

    const submitData = async () => {
        if (formData.vendorId === "") {
            const resultSet = {}
            let data = vendorHeader.filter(e => e.id === formData.name)
            if (data !== undefined) {
                resultSet.name = data[0].name
            }
            const result = getFilterKey(resultSet).slice(0, -1)
            const response = await makeRequest("GET", null, "/report/vendortrailbalancereport?filter=" + result)
            if (response.status === "Success") {
                downloadReport(response, "pdf", "TRIAL_BALANCE_" + formData.name)
            }
        } else {
            const resultSet = {}
            let data = vendor.filter(e => e.id === formData.vendorId)
            if (data !== undefined) {
                resultSet.vendorId = data[0].id
            }
            const response = await makeRequest("GET", null, "/report/currencyreportpdf?filter=vendorId=" + formData.vendorId)
            if (response.status === "Success") {
                downloadReport(response, "pdf", "LEDGER_REPORT_" + formData.vendorId)
            }
        }
    }




    return (
        <>

            <ContentHeader titleName={"Ledger Report"} buttonName={"Generate Report"} submitData={handleModal} />
            <Form
                title={"Ledger Vendor Selection"}
                children={<>
                    <div style={{ display: 'flex' }}>
                        <SelectComponent data={formData.name} option={vendorHeader} name={"name"} setFormData={setFormData} placeholder={"Enter Vendor Header: "}  validationText={"Vendor Header Not selected"} />
                        <SelectComponent data={formData.vendorId} option={vendor} name={"vendorId"} setFormData={setFormData} placeholder={"Enter Vendor : "}  validationText={"Vendor  Not selected"} />
                    </div>
                    <div style={{ height: "10px" }}></div>
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Want to Generate Trial Balance report?"} />
        </>
    )
}
