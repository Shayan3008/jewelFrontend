import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import InputField from '../../components/common/input/InputField'
import Form from '../../components/form/Form'
import "react-datepicker/dist/react-datepicker.css";
import { getMessageFromAxiosError, makeRequest, validateFields, viewButton, viewOrEditHelper } from '../../utils/HelperUtils';
import ModalComponent from '../../components/modal/ModalComponent';
import SelectComponent from '../../components/common/Select/SelectComponent';
import { useNavigate } from 'react-router';
import { trnType } from '../../constants/constantData'
import { showDialog } from '../../store/Actions/MessageDialogAction';
import { useDispatch } from 'react-redux';

export default function AddCurrencyTransaction() {

    const [currencyList, setCurrencyList] = useState([])
    const [currency, setCurrency] = useState([])
    const [modal, setModal] = useState(false)
    const [view, setView] = useState(false)
    const dispatch = useDispatch();
    const [update, setUpdate] = useState(false)
    const navigate = useNavigate()
    const [validator, setValidator] = useState({
        id: false,
        trnType: false,
        amount: false,
        exchangeRate: false,
        currencyCode: false,
        qty: false,
        trnDate: false
    })
    const [formData, setFormData] = useState({
        id: "",
        trnType: "",
        amount: 0.0,
        exchangeRate: 0.0,
        description: "",
        currencyId: "",
        qty: 0,
        trnDate: ""
    })

    const getTotalPresentAmountInCurrency = () => {
        if (formData.currencyId.length === 0) return "0"
        let currency = currencyList.filter(e => e.id === formData.currencyId)
        if (currency !== null && currency.length > 0 && currency[0].presentAmount !== null) {
            if(formData.trnType.length === 0)
                return currency[0].presentAmount.toString()
            else if (formData.trnType === "DEBIT")
                return (Number(currency[0].presentAmount) + Number(formData.qty)).toString()
            else if (formData.trnType === "CREDIT")
                return (Number(currency[0].presentAmount) - Number(formData.qty)).toString()
        }
        return "0"
    }


    const validate = () => {
        const data = { ...validator }
        if (formData.currencyId.length === 0)
            data.currencyCode = true;
        if (Number(formData.qty) <= 0)
            data.qty = true;
        if (formData.trnType.length === 0)
            validator.trnType = true
        if (Number(formData.exchangeRate) <= 0)
            validator.exchangeRate = true
        return data
    }
    const getCurrencyCodes = async () => {
        try {
            const response = await makeRequest("GET", null, "/currency")
            if (response.statusCode === 200) {
                const data = []
                for (let i of response.body) {

                    const obj = {
                        id: i.id,
                        name: i.currencyName
                    }
                    data.push(obj)
                }
                setCurrency(data)
                setCurrencyList(response.body)
            }
        } catch (error) {
            alert(getMessageFromAxiosError(error))
        }
    }

    useEffect(() => {
        getCurrencyCodes()
        viewOrEdit()
    }, [])


    const handleModal = () => {
        setFormData(data => ({
            ...data,
            amount: data.exchangeRate * data.qty,
        }))
        const data = validate()
        console.log(data)
        const validated = validateFields(data, setValidator, validator)
        if (validated === false)
            return;
        setModal(e => !e)
    }

    const viewOrEdit = () => {
        const currencyTransactionData = viewOrEditHelper(setView, setUpdate)
        if (currencyTransactionData !== null && currencyTransactionData !== undefined) {
            setFormData({
                currencyId: currencyTransactionData.currencyId,
                amount: currencyTransactionData.amount,
                description: currencyTransactionData.description,
                exchangeRate: currencyTransactionData.exchangeRate,
                id: currencyTransactionData.id,
                qty: currencyTransactionData.qty,
                trnType: currencyTransactionData.trnType
            })

        }
    }


    const submitData = async () => {
        try {
            let response = await makeRequest("POST", formData, "/currencytransaction/save")
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
            <ContentHeader isView={viewButton()} titleName={`${viewButton() ? 'View' : update ? 'Update' : 'Add'} currency transaction`} buttonName={`${update ? 'Update' : 'Submit'}`} submitData={handleModal} />
            <Form
                title={"Currency Transactions"}
                children={<>

                    <div style={{ display: 'flex' }}>
                        <SelectComponent disabled={view || update} data={formData.currencyId} name={"currencyId"} option={currency} setFormData={setFormData} placeholder={"Enter Currency Code"}
                            validator={validator.currencyCode} validationText={"Please Enter Currency"} />
                        <SelectComponent disabled={view || update} data={formData.trnType} name={"trnType"} option={trnType} setFormData={setFormData} placeholder={"Enter Transaction Type"} validator={validator.trnType} validationText={"Please Enter transaction type"} />
                        <InputField labelName={"Transaction Date"} type={"date"} inputValue={formData.trnDate} setInputValue={setFormData} name={"trnDate"} validator={validator.trnDate}
                        validationText={"Transaction Date Cannot be empty"} />

                    </div>
                    <div style={{ height: "10px" }}></div>
                    <div style={{ display: 'flex' }}>
                        <InputField disable={view} labelName={"Description"} inputValue={formData.description} name={"description"} setInputValue={setFormData}
                        />
                        <InputField disable={view} labelName={"Qty"} inputValue={formData.qty} name={"qty"} setInputValue={setFormData} validator={validator.qty} validationText={"Qty should be greater than zero"} />
                        <InputField disable={view} labelName={"Exchange Rate"} inputValue={formData.exchangeRate} name={"exchangeRate"} setInputValue={setFormData} validator={validator.exchangeRate} validationText={"Exchange rate should be greater than 0"} />


                    </div>
                    <div style={{ height: '10px' }}></div>
                    <div style={{ display: 'flex' }}>
                        <InputField labelName={"Amount"} value={Number(formData.exchangeRate) * Number(formData.qty)} />
                        <InputField labelName={"Present Amount"} value={getTotalPresentAmountInCurrency()} />
                    </div>
                </>}
            />

            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to add transaction ?"} />
        </>
    )
}




