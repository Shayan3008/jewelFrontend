import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchAllVendors } from '../../common/dropdown/vendor'
import SelectComponent from '../../components/common/Select/SelectComponent'
import InputField from '../../components/common/input/InputField'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import Form from '../../components/form/Form'
import ModalComponent from '../../components/modal/ModalComponent'
import { goldPurity, purchaseOption, trnType } from '../../constants/constantData'
import { showDialog } from '../../store/Actions/MessageDialogAction'
import { getMessageFromAxiosError, goldRate, makeRequest, validateFields } from '../../utils/HelperUtils'

export default function GoldPurchase() {

    const rate = useSelector(state => state.goldRateReducer.goldRate)
    const [vendor, setVendor] = useState([])
    const [modal, setModal] = useState(false)





    const showDataBasedOnOptions = () => {
        if (formData.option === "Gold")
            return <>

                <div>
                    <SelectComponent data={formData.trnType} name={"trnType"} option={trnType} setFormData={setFormData} placeholder={"Enter Transaction Type"} validator={validator.trnType} validationText={"Transaction type must be selected"} />
                </div>
                <div>
                    <SelectComponent data={formData.goldPurity} name={"goldPurity"} option={goldPurity} setFormData={setFormData} placeholder={"Enter Gold Purity"} validator={validator.goldPurity} validationText={"Gold Purity must be selected."} />
                </div>
            </>
        else
            return <>
                <div>
                    <SelectComponent data={formData.trnType} name={"trnType"} option={trnType} setFormData={setFormData} placeholder={"Enter Transaction Type"} validator={validator.trnType} validationText={"Transaction type must be selected"} />
                </div>
                <InputField labelName={"Cash Amount"} inputValue={formData.amount} setInputValue={setFormData} name={"amount"} validator={validator.amount} validationText={"Amount must be greater than zero."} />
            </>


    }


    const handleModal = () => {
        const data = validate()
        if (data === null)
            return;
        const validated = validateFields(data, setValidator, validator)
        if (validated === false)
            return;

        setModal(e => !e)
    }

    const validate = () => {


        const data = { ...validator }
        if (formData.purchaseDate.length === 0)
            data.purchaseDate = true;
        if (formData.amount < 0)
            data.amount = true;
        if (formData.option === "Gold") {

            if (formData.goldPurity.length === 0)
                data.goldPurity = true;
            if (formData.goldWeight <= 0)
                data.goldWeight = true
        }
        if (formData.option.length === 0)
            data.option = true;
        if (formData.trnType.length === 0)
            data.trnType = true;
        if (formData.vendorId.length === 0)
            data.vendorId = true;
        return data
    }

    const navigate = useNavigate()

    const [validator, setValidator] = useState({
        purchaseDate: false,
        description: false,
        trnType: false,
        goldPurity: false,
        goldRate: false,
        goldWeight: false,
        amount: false,
        option: false,
        vendorId: false
    })

    const [update, setUpdate] = useState(false)
    const dispatch = useDispatch()

    const submitData = async () => {
        try {
            let response;
            if (update === false) {

                response = await makeRequest("POST", formData, "/goldpurchase/save")
            }
            else {
                // response = await makeRequest("PUT", formData, "/karigar/update")
            }
            dispatch(showDialog(true, response.message, false))

            setFormData(e => ({
                purchaseDate: "",
                description: "",
                trnType: "",
                goldPurity: "",
                goldRate: rate,
                goldWeight: "",
                amount: 0.0,
                option: "",
                vendorId: "",
                totalStandingCash: 0,
                totalStandingGold: 0
            }))

        } catch (error) {
            dispatch(showDialog(true, getMessageFromAxiosError(error), true))
        }

        setTimeout(() => {
            dispatch(showDialog(false, "", false))

        }, 3000);
    }
    const [formData, setFormData] = useState({
        purchaseDate: "",
        description: "",
        trnType: "",
        goldPurity: "",
        goldRate: rate,
        goldWeight: "",
        amount: 0.0,
        option: "",
        vendorId: "",
        totalStandingCash: 0,
        totalStandingGold: 0
    })

    const fetchData = async () => {
        try {
            const request = await fetchAllVendors()
            if (request !== null) {
                setVendor(request)
            }
        } catch (error) {
            alert(getMessageFromAxiosError(error))
        }
    }

    const callAndGetVendorCashAndGold = async () => {
        const request = await makeRequest("GET", null, "/vendor/getVendorTotalStandingCashAndGold/" + formData.vendorId);
        if (request.statusCode === 200) {
            setFormData((e) => ({
                ...e,
                totalStandingCash: request.body.cash,
                totalStandingGold: request.body.gold
            }))
        }
    }

    useEffect(() => {


        if (formData.vendorId > 0)
            callAndGetVendorCashAndGold()

        if (vendor.length === 0)
            fetchData()
        setFormData(e => ({
            ...e,
            amount: goldRate(formData.goldPurity, rate) * Number(formData.goldWeight).toFixed(2)
        }))
    }, [formData.goldPurity, formData.goldWeight, formData.vendorId])

    const calculateTotalStandingCash = () => {
        if (formData.amount <= 0)
            return formData.totalStandingCash;
        if (formData.option === "Cash") {
            if (formData.trnType === "CREDIT") {
                return Number(formData.totalStandingCash) - Number(formData.amount)
            } else {
                return Number(formData.totalStandingCash) + Number(formData.amount)
            }
        } else {
            if (formData.trnType === "CREDIT") {
                return Number(formData.totalStandingCash) + Number(formData.amount)
            } else {
                return Number(formData.totalStandingCash) - Number(formData.amount)
            }
        }
    }


    const calculateTotalStandingGold = () => {
        if (formData.goldWeight <= 0)
            return formData.totalStandingGold;
        if (formData.option === "Gold") {
            if (formData.trnType === "CREDIT") {
                return formData.totalStandingGold - Number(formData.goldWeight)
            } else {
                return formData.totalStandingGold + Number(formData.goldWeight)
            }
        }
        return formData.totalStandingGold
    }

    return (
        <>
            <ContentHeader titleName={`Ledger Voucher`} buttonName={`${false ? 'Update' : 'Submit'}`} submitData={handleModal} />
            <Form
                title={"Transaction Details"}
                children={<>

                    <div style={{ display: 'flex' }}>
                        <InputField labelName={"Purchase date"} inputValue={formData.purchaseDate} setInputValue={setFormData} name={"purchaseDate"} type={"date"} validator={validator.purchaseDate} validationText={"Date Cannot be empty"} />
                        <div>
                            <SelectComponent data={formData.option} name={"option"} option={purchaseOption} setFormData={setFormData} placeholder={"Enter Purchase Option"} validator={validator.option} validationText={"Payment type must be selected"} />
                        </div>
                        <div>
                            <SelectComponent data={formData.vendorId} name={"vendorId"} option={vendor} setFormData={setFormData} placeholder={"Select Vendor For transaction"}
                                validator={validator.vendorId} validationText={"Vendor must be selected."} />
                        </div>
                    </div>
                    <div style={{ height: "10px" }}></div>


                    {formData.option === "" ? null : <><div style={{ display: 'flex' }}>

                        <InputField labelName={"Description"} inputValue={formData.description} name={"description"} setInputValue={setFormData} />
                        {showDataBasedOnOptions()}
                    </div>
                        <div style={{ height: "10px" }}></div>
                        {formData.option === "Cash" ? null : <div style={{ display: 'flex' }}>
                            <InputField labelName={"Gold Weight"} inputValue={formData.goldWeight} setInputValue={setFormData} name={"goldWeight"} validator={validator.goldWeight}
                                validationText={"Gold weight cannot be zero"} />
                            <InputField labelName={"Payment Done"} inputValue={formData.amount} setInputValue={setFormData} name={"amount"} />

                        </div>}
                    </>}
                    <div style={{ height: "10px" }}></div>
                    {formData.vendorId > 0 ? <div style={{ display: 'flex' }}>
                        <InputField color={'green'} labelName={"Total Standing Cash"} value={calculateTotalStandingCash()} />
                        <InputField labelName={"Total Standing Gold"} value={calculateTotalStandingGold()} />

                    </div> : null}
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to make transaction?"} />
        </>
    )
}
