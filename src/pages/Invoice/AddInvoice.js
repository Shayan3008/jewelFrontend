import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import InputField from '../../components/common/input/InputField'
import Form from '../../components/form/Form'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-dropdown-select';
import { downloadReport, getMessageFromAxiosError, goldRate, makeRequest, viewButton } from '../../utils/HelperUtils';
import ModalComponent from '../../components/modal/ModalComponent';
import SelectComponent from '../../components/common/Select/SelectComponent';
import { useNavigate } from 'react-router';
import InvoiceWithItem from './Components/InvoiceWithItem';
import InvoiceWithoutItem from './Components/InvoiceWithoutItem';
import { useDispatch, useSelector } from 'react-redux';
import { showDialog } from '../../store/Actions/MessageDialogAction';

export default function AddInvoice() {

    // Intializing the state
    const rate = useSelector(state => state.goldRateReducer.goldRate)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [openGenerateModal, setGenerateModal] = useState(false)
    const [category, setCategory] = useState([])
    const [categoryBody, setCategoryBody] = useState([])
    const [netWeight, setNetWeight] = useState(0);
    const [item, setItem] = useState({})
    const [itemOption, setItemOption] = useState([])
    const [wastePer, setWastePer] = useState([])
    const [modal, setModal] = useState(false)
    const [view, setView] = useState(false)
    const [validator, setValidator] = useState({
        invoiceDate: false,
        wastePer: false,
        goldPrice: false,
        totalItemPrice: false,
        totalBill: false,
        making: false,
        qty: false,
        itemId: false,
        netWeight: false,
        totalWeight: false,
        itemWeight: false
    })
    const [formData, setFormData] = useState({
        id: "",
        invoiceDate: "",
        categoryCode: "",
        wastePer: 0,
        goldPrice: 0.0,
        totalItemPrice: 0,
        totalBill: 0,
        making: 0,
        qty: 1,
        itemId: "",
        netWeight: 0,
        totalWeight: 0,
        itemWeight: 0,
        goldRate: rate,
        currentGoldPrice: 0,
        beadAmount: 0.0,
        bigStoneAmount: 0.0,
        smallStoneAmount: 0.0,
        doliPolish: 0.0,
        goldPurity: "24K",
        diamondAmount: 0.0,
        chandiAmount: 0.0,
        discount: 0.0,
        diamondRate: 0.0,
        description: ""
    })
    // case if sale is made without any item
    const [invoiceWithoutItem, setInvoiceWithoutItem] = useState(false);
    const [saleWithoutPay, setSaleWithoutPay] = useState(false)


    const loadData = () => {
        const invoice = JSON.parse(localStorage.getItem("view"))
        if (invoice === null) {
            console.log("Added Or update invoice")
        } else {
            let netWeight = (Number(invoice.totalWeight) / ((Number(invoice.wastePer) / 100) + 1)).toFixed(2)
            let date = new Date(invoice.invoiceDate).toISOString().split("T")[0]
            let goldRate = Number(Number(invoice.totalItemPrice) / Number(invoice.totalWeight)).toFixed(2)
            setFormData({
                id: invoice.id,
                invoiceDate: date,
                categoryCode: invoice.itemResponseDTO === null ? "" : invoice.itemResponseDTO.categoryId,
                wastePer: invoice.wastePer,
                goldPrice: 0.0,
                totalItemPrice: invoice.totalItemPrice,
                totalBill: invoice.totalBill,
                making: invoice.making,
                qty: invoice.qty,
                itemId: invoice.itemResponseDTO === null ? "" : invoice.itemResponseDTO.id,
                netWeight: invoice.itemResponseDTO === null ? netWeight : invoice.itemResponseDTO.netWeight,
                totalWeight: invoice.totalWeight,
                itemWeight: invoice.itemWeight,
                goldRate: goldRate,
                currentGoldPrice: invoice.currentGoldPrice,
                beadAmount: invoice.beadAmount,
                bigStoneAmount: invoice.bigStoneAmount,
                smallStoneAmount: invoice.smallStoneAmount,
                doliPolish: invoice.doliPolish,
                diamondAmount: invoice.diamondAmount,
                chandiAmount: invoice.chandiAmount,
                discount: invoice.discount,
                diamondRate: invoice.diamondRate,
                description: invoice.description

            })
            setView(true)
            if (invoice.itemResponseDTO === null) {
                setInvoiceWithoutItem(true)
            }
        }
    }

    const getDesign = (categoryId) => {
        const items = categoryBody.filter(e => e.categoryCode === categoryId)
        if (items === null || items.length === 0)
            return
        const itemResponse = items[0].itemResponseDTOs
        const data = []
        for (const element of itemResponse) {
            data.push({
                id: element.id,
                name: element.designNo
            })
        }
        setItemOption(data)
    }

    const getItem = async () => {
        try {
            if (itemOption.length > 0)
                return;

            const response = await makeRequest("GET", null, "/category")
            if (response.statusCode === 200) {
                const category = response.body.map(e => ({
                    id: e.categoryCode,
                    name: e.categoryName
                }))
                setCategory(category)
                setCategoryBody(response.body)
            }
        } catch (error) {
            getMessageFromAxiosError(error)
        }
    }


    if (wastePer.length === 0) {
        const arr = Array.from({ length: 101 }, (_, index) => index)
        setWastePer(arr.map(e => ({
            id: e,
            name: e
        })));
    }

    useEffect(() => {
        getItem()
        loadData()
    }, [])


    const handleModal = () => {
        setFormData(data => ({
            ...data,
            totalBill: getTotalBill(formData),
            totalItemPrice: getTotalItemPrice(formData),
            totalWeight: invoiceWithoutItem ? (((Number(formData.wastePer) / 100) * formData.netWeight) + Number(formData.netWeight)).toFixed(2) : (((Number(formData.wastePer) / 100) * netWeight) + netWeight).toFixed(2),
            itemWeight: (Number(item.netWeight) / Number(item.qty)) * Number(formData.qty),
        }))
        if (item !== null && Object.keys(item).length > 0)
            setFormData(data => ({
                ...data,
                goldRate: goldRate(item.karat, rate)
            }))
        setModal(e => !e)
    }

    const handleReportModal = () => {
        setGenerateModal(e => !e)
    }

    const submitData = async () => {

        try {
            let response = null;
            if (invoiceWithoutItem) {
                response = await makeRequest("POST", formData, "/invoice/savewithoutitem")

            } else {
                response = await makeRequest("POST", formData, "/invoice/save")
            }

            dispatch(showDialog(true, response.message, false))
            if (response.statusCode === 200) {
                // alert(response.message)
                navigate("/invoice")
            }
        } catch (error) {
            dispatch(showDialog(true, getMessageFromAxiosError(error), true))
        }
        setTimeout(() => {
            dispatch(showDialog(false, "", false))
            navigate(-1)
        }, 3000);

    }

    function calculateTotalWeight() {
        // Means That invoice is already created and only needs to be seen.
        if (view === true) {
            return Number(formData.totalWeight).toString()
        }

        let wastePer = (Number(formData.wastePer) / 100)
        let totalWeight = 0

        if (item.multiItem === true) {
            totalWeight = (Number(item.netWeight) / Number(item.qty)) * Number(formData.qty)

            return ((wastePer * totalWeight) + totalWeight).toFixed(2).toString();
        }
        else if (item.multiItem === false || item.multiItem === null) {

            totalWeight = (Number(item.netWeight) * wastePer + Number(item.netWeight))
            return totalWeight.toFixed(2).toString()
        }
        else if (Number(formData.qty) > Number(item.qty))
            return "Cannot be more than total number of items."
    }
    const getTotalItemPrice = (formData) => {

        if (Number(item.qty) > 1)
            return (Number(formData.goldRate) * Number(calculateTotalWeight())).toFixed(2)
        let wastePer = (Number(formData.wastePer) / 100)
        let totalWeight = 0

        if (item !== null && Object.keys(item).length > 0) {

            totalWeight = (Number(item.netWeight) * wastePer + Number(item.netWeight))
            return goldRate(item.karat, formData.goldRaterate) * totalWeight;
        }
        else {

            totalWeight = (Number(formData.netWeight) * wastePer + Number(formData.netWeight))
            if (view === true) {
                return formData.totalItemPrice
            }
            return (goldRate(formData.goldPurity, formData.goldRate) * totalWeight).toFixed(2);
        }
    }

    const navigateBack = () => {
        navigate(-1)
    }

    const generateReport = async () => {
        try {
            if (view === false) return
            const response = await makeRequest("GET", null, "/report/invoicereport/" + formData.id)
            if (response.status === "Success") {
                downloadReport(response, "pdf", "InvoiceReport_" + formData.id)
            }

        } catch (error) {
            console.log(error)
        }
    }

    function getTotalBill(formData) {

        return (Number(formData.making) + Number(formData.beadAmount) + Number(formData.bigStoneAmount) + Number(formData.smallStoneAmount) + Number(formData.doliPolish) + Number(formData.diamondAmount) + Number(formData.chandiAmount) - Number(formData.discount) + Number(formData.diamondRate) + Number(getTotalItemPrice(formData))).toFixed(2);
    }
    try {
        return (

            <>
                <ContentHeader isView={viewButton()} multiOption={true} titleName={`${view ? 'View' : false ? 'Update' : 'Add'} Invoice`} buttonName={`${false ? 'Update' : 'Submit'}`} submitData={handleModal} multiName={viewButton() === true ?
                    [
                        {
                            name: "Back",
                            method: navigateBack,
                            color: 'red'
                        },
                        {
                            name: "Generate Report",
                            method: handleReportModal,
                            color: ""
                        }
                    ] : [
                        {
                            name: "Back",
                            method: navigateBack,
                            color: 'red'
                        },
                        {
                            name: "Submit",
                            method: handleModal,
                            color: '#25B491'
                        }
                    ]} />
                <Form
                    title={"Invoice Details"}
                    children={<>

                        <div style={{ display: 'flex' }}>
                            <InputField disable={view} labelName={"UserName"} value={localStorage.getItem("name") == null ? 'admin' : localStorage.getItem("name")} />
                            <InputField disable={view} labelName={"Invoice date"} inputValue={formData.invoiceDate} setInputValue={setFormData} name={"invoiceDate"} type={"date"} validator={validator.invoiceDate} validationText={"Invoice Date cannot be empty"} />
                            <InputField disable={view} labelName={"Description"} inputValue={formData.description} name={"description"} setInputValue={setFormData} />

                        </div>
                        <div style={{ height: "10px" }}></div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', width: '31vw' }}>
                                <input type='checkbox' style={{
                                    transform: 'scale(2)',
                                    accentColor: 'rgb(37, 180, 145)'
                                }} value={!invoiceWithoutItem} disabled={view} onChange={() => setInvoiceWithoutItem(e => !e)} />
                                <div style={{ width: '20px' }}></div>
                                <h5 style={{ margin: 0, padding: 0 }}>Sale Without Item</h5>
                            </div>

                            <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', width: '31vw' }}>
                                <input type='checkbox' style={{
                                    transform: 'scale(2)',
                                    accentColor: 'rgb(37, 180, 145)'
                                }} value={saleWithoutPay} disabled={view} onChange={() => {
                                    if (saleWithoutPay === false)
                                        setFormData(data => ({
                                            ...data,
                                            goldRate: 0
                                        }))
                                    else
                                        setFormData(data => ({
                                            ...data,
                                            goldRate: rate
                                        }))
                                    setSaleWithoutPay(e => !e)
                                }
                                } />
                                <div style={{ width: '20px' }}></div>
                                <h5 style={{ margin: 0, padding: 0 }}>Sale Without Cash</h5>
                            </div>
                            <div>

                                <Select disabled={invoiceWithoutItem || view} className='input-container' style={{
                                    padding: '1rem',
                                    margin: '1rem',
                                    fontSize: '16px',
                                    border: '1px solid lightgray',
                                    borderRadius: '5px',
                                    outline: 'none',
                                    transition: 'all 1s ease',
                                    boxShadow: '0 6px 10px 0 rgba(0, 0, 0, 0.1)',
                                    width: '29vw'

                                }} placeholder='Select item'
                                    options={category}
                                    labelField="name"
                                    valueField="id"
                                    values={category.length > 0 && formData.categoryCode ? [category.find(e => e.id === formData.categoryCode)] : []}
                                    onChange={(values) => {
                                        if (values !== undefined && values.length === 0) {
                                            setFormData(data => ({
                                                ...data,
                                                categoryCode: ''
                                            }));
                                        } else {
                                            setFormData(data => ({
                                                ...data,
                                                categoryCode: values[0].id
                                            }))
                                            getDesign(values[0].id)
                                        }
                                    }
                                    }
                                    clearable={true}
                                />
                                <p style={{
                                    display: validator.itemId ? 'block' : `none`,
                                    color: 'red',
                                    paddingTop: '2px',
                                    margin: '1rem'
                                }}>Item must be selected</p>
                            </div>


                        </div>
                        <div style={{ height: "10px" }}></div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', width: '31vw' }}>

                                <SelectComponent disabled={invoiceWithoutItem || view} name={"itemId"} option={itemOption} setFormData={setFormData} data={formData.itemId} placeholder={"Enter Design No"} />
                            </div>
                        </div>
                    </>}
                />
                {formData.itemId === "" ? null : <InvoiceWithItem rate={rate} formData={formData} getTotalBill={getTotalBill} getTotalItemPrice={getTotalItemPrice} item={item} setFormData={setFormData} setItem={setItem} validator={validator} view={view} wastePer={wastePer} calculateTotalWeight={calculateTotalWeight} saleWithoutPay={saleWithoutPay} />}
                {!invoiceWithoutItem ? null : <InvoiceWithoutItem rate={rate} formData={formData} getTotalBill={getTotalBill} setFormData={setFormData} validator={validator} view={view} wastePer={wastePer} saleWithoutPay={saleWithoutPay} />}
                <ModalComponent modal={openGenerateModal} handleModal={handleReportModal} onSuccess={generateReport} bodyText={"Do you want to generate report ?"} />
                <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to add invoice ?"} />
            </>
        )
    } catch (error) {
        console.log(error)
    }

}




