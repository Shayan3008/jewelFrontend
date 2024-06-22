import React, { useEffect, useState } from 'react'
import { getMessageFromAxiosError, makeRequest, validateFields } from '../../utils/HelperUtils';
import { useNavigate } from 'react-router'
import ModalComponent from '../../components/modal/ModalComponent';
import InputField from '../../components/common/input/InputField';
import ContentHeader from '../../components/contentHeader/ContentHeader';
import Form from '../../components/form/Form';
import { fetchAllVendors } from '../../common/dropdown/vendor';
import SelectComponent from '../../components/common/Select/SelectComponent';
import { trnType } from '../../constants/constantData';
import { useDispatch } from 'react-redux';
import { showDialog } from '../../store/Actions/MessageDialogAction';

export default function JournalVoucher() {


    const navigate = useNavigate()
    const [goldRates, setGoldRates] = useState({
        debitWeight: 0,
        creditWeight: 0,
    });

    const [modal, setModal] = useState(false)

    const dispatch = useDispatch()

    const [vendor, setVendor] = useState([])

    const [formData, setFormData] = useState({
        vendorId: "",
        trnType: "",
        goldWeight: 0,
        amount: 0,
        goldRate: 0
    })

    const [validator, setValidator] = useState({
        vendorId: false,
        trnType: false,
        goldWeight: false,
        amount: false,
        goldRate: false
    })

    const handleModal = () => {
        setFormData(e => ({
            ...e,
            amount: Number(formData.amount) * Number(formData.goldWeight)
        }))
        const data = validate()
        console.log(data)
        const validated = validateFields(data, setValidator, validator)
        if (validated === false)
            return;

        setModal(e => !e)
    }

    const fetchData = async () => {
        if (vendor !== undefined && vendor.length > 0) return;
        try {
            const request = await fetchAllVendors()
            if (request !== null) {
                setVendor(request)
            }
        } catch (error) {
            alert(getMessageFromAxiosError(error))
        }
    }

    const fetchVendorRates = async () => {
        try {
            if (Number(goldRates.debitWeight) > 0 || Number(goldRates.creditWeight) > 0)
                return;
            const response = await makeRequest("GET", null, `/vendor/getGoldTransactionForVendor/${formData.vendorId}`)
            if (response.statusCode === 200) {
                setGoldRates({
                    debitWeight: response.body.debitGoldWeight,
                    creditWeight: response.body.creditGoldWeight
                })
            }
        } catch (error) {
            console.log(error)
            // alert(getMessageFromAxiosError(error))
        }
    }


    useEffect(() => {

        fetchData()
        if (formData.vendorId !== "")
            fetchVendorRates()
    }, [formData.vendorId])



    const submitData = async () => {
        try {


            const response = await makeRequest("POST", formData, '/vendor/convertgoldtoledger')
            dispatch(showDialog(true, response.message, false))
        } catch (error) {
            
            dispatch(showDialog(true, getMessageFromAxiosError(error), true))
        }
        setTimeout(() => {
            dispatch(showDialog(false, "", false))
            navigate('/home')
        }, 4000);
    }


    const validate = () => {
        const data = { ...validator }
        if (Number(formData.goldRate) <= 0)
            data.amount = true;
        if (formData.trnType.length === 0)
            data.trnType = true
        if (goldRates !== null && goldRates !== undefined) {
            console.log(formData)
            console.log(goldRates)
            if (formData.trnType === "SALE" && Number(formData.goldWeight) > Number(goldRates.creditWeight))
                data.goldWeight = true
            else if (formData.trnType === "PURCHASE" && Number(formData.goldWeight) > Number(goldRates.debitWeight))
                data.goldWeight = true
        }
        return data
    }

    return (
        <>
            <ContentHeader titleName={`Journal Voucher`} buttonName={`${false ? 'Update' : 'Submit'}`} submitData={handleModal} />
            <Form
                title={"Journal Voucher"}
                children={<>

                    <div style={{ display: 'flex' }}>

                        <div>
                            <SelectComponent data={formData.vendorId} name={"vendorId"} option={vendor} setFormData={setFormData} placeholder={"Select Vendor For transaction"}
                                validator={validator.vendorId} validationText={"Vendor must be selected."} />
                        </div>
                        <div>
                            <SelectComponent data={formData.trnType} name={"trnType"} option={trnType} setFormData={setFormData} placeholder={"Enter Transaction Type"} validator={validator.trnType} validationText={"Transaction type must be selected"} />
                        </div>
                        {formData.vendorId !== undefined && formData.vendorId.length === 0 ? null : <InputField labelName={"Gold Weight"} inputValue={formData.goldWeight} setInputValue={setFormData} name={"goldWeight"} validator={validator.goldWeight} validationText={"Gold Weight cannot be empty and cannot be greater than credit or debit goldWeight"} />}
                    </div>
                    <div style={{ height: '10px' }}></div>
                    {formData.vendorId !== undefined && formData.vendorId.length === 0 ? null :
                        <div style={{ display: 'flex' }}>
                            <InputField labelName={"Gold Rate per gm"} inputValue={formData.goldRate} setInputValue={setFormData} name={"goldRate"}
                                validator={validator.goldRate} validationText={"Amount should be greater than 0."} />
                            <InputField labelName={"Current debit weight"} value={goldRates.debitWeight} />
                            <InputField labelName={"Current credit weight"} value={goldRates.creditWeight} />
                        </div>
                    }
                    <div style={{ height: '10px' }}></div>
                    {formData.vendorId !== undefined && formData.vendorId.length === 0 ? null :
                        <div style={{ display: 'flex' }}>
                            <InputField labelName={"Amount"} value={Number(formData.goldRate) * Number(formData.goldWeight)} />
                        </div>
                    }
                </>}
            />
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to make transaction?"} />
        </>
    )
}
