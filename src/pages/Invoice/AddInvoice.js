import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import InputField from '../../components/common/input/InputField'
import Form from '../../components/form/Form'

import "react-datepicker/dist/react-datepicker.css";
import Inventory from '../Inventory/Inventory';
import Select from 'react-dropdown-select';
import { getMessageFromAxiosError, makeRequest } from '../../utils/HelperUtils';
import ModalComponent from '../../components/modal/ModalComponent';
import SelectComponent from '../../components/common/Select/SelectComponent';
import { useNavigate } from 'react-router';

export default function AddInvoice() {

    const navigate = useNavigate()
    const [category, setCategory] = useState([])
    const [categoryBody,setCategoryBody] = useState([])
    const [netWeight, setNetWeight] = useState(0);
    const [itemOption, setItemOption] = useState([])
    const [wastePer, setWastePer] = useState([])
    const [modal, setModal] = useState(false)
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
        totalWeight: false
    })
    const [formData, setFormData] = useState({
        invoiceDate: "",
        categoryCode: "",
        wastePer: 0,
        goldPrice: 0,
        totalItemPrice: 0,
        totalBill: 0,
        making: 0,
        qty: 1,
        itemId: "",
        netWeight: 0,
        totalWeight: 0
    })

    const getDesign = (categoryId) => {
        const items = categoryBody.filter(e => e.categoryCode === categoryId)
        console.log(items[0].itemResponseDTOs.length)
        if (items === null || items.length === 0 )
            return
        const itemResponse =     items[0].itemResponseDTOs
        const data = []
        for (var i = 0; i < itemResponse.length; i++) {
            data.push({
                id: itemResponse[i].id,
                name: itemResponse[i].designNo
            })
        }
        console.log(data)
        setItemOption(data)
    }

    useEffect(() => {

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
                    console.log(category)
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



        const getGoldRateForDate = async () => {
            if (formData.invoiceDate.length > 0) {
                const date = new Date(formData.invoiceDate);
                const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                console.log(formattedDate);
                try {

                    const response = await makeRequest("GET", null, `/invoice/getgoldrate?date=${formattedDate}`);
                    if (response.statusCode === 200) {
                        setFormData(data => ({
                            ...data,
                            goldPrice: response.body
                        }));
                    }
                    else {
                        alert(response.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        getItem()
        getGoldRateForDate();
    }, [formData.invoiceDate])


    const handleModal = () => {
        setFormData(data => ({
            ...data,
            totalBill: getTotalBill(formData),
            totalItemPrice: getTotalItemPrice(formData),
            totalWeight: (((Number(formData.wastePer) / 100) * netWeight) + netWeight).toFixed(2)
        }))
        setModal(e => !e)
    }
    const submitData = async () => {
        console.log(getTotalItemPrice(formData))

        console.log(formData)
        try {

            const response = await makeRequest("POST", formData, "/invoice/save")
            if (response.statusCode === 200) {
                alert(response.message)
                navigate(-1)
            }
        } catch (error) {
            alert(getMessageFromAxiosError(error))
        }

    }
    const getTotalItemPrice = (formData) => {
        return (formData.goldPrice * (((Number(formData.wastePer) / 100) * netWeight) + netWeight)).toFixed(2);
    }

    function getTotalBill(formData) {
        return (Number(formData.making) + Number(getTotalItemPrice(formData))).toFixed(2);
    }
    return (
        <>
            <ContentHeader titleName={`${false ? 'Update' : 'Add'} Invoice`} buttonName={`${false ? 'Update' : 'Submit'}`} submitData={handleModal} />
            <Form
                title={"Invoice Details"}
                children={<>

                    <div style={{ display: 'flex' }}>
                        <InputField labelName={"UserName"} value={localStorage.getItem("name") == null ? 'admin' : localStorage.getItem("name")} />
                        <InputField labelName={"Invoice date"} inputValue={formData.invoiceDate} setInputValue={setFormData} name={"invoiceDate"} type={"date"} validator={validator.invoiceDate} validationText={"Invoice Date cannot be empty"} />
                        <div>

                            <Select className='input-container' style={{
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
                                values={category.length > 0 && formData.itemId ? [category.find(e => e.categoryCode === formData.categoryCode)] : []}
                                onChange={(values) => {
                                    console.log(values)
                                    setFormData(data => ({
                                        ...data,
                                        categoryCode: values[0].id
                                    }))
                                    getDesign(values[0].id)
                                }
                                } />
                            <p style={{
                                display: validator.itemId ? 'block' : `none`,
                                color: 'red',
                                paddingTop: '2px',
                                margin: '1rem'
                            }}>Item must be selected</p>
                        </div>

                    </div>
                    <div style={{ height: "10px" }}></div>
                    <div>
                        <SelectComponent name={"itemId"} option={itemOption} setFormData={setFormData} data={formData.itemId} placeholder={"Enter Design No"} />
                    </div>
                </>}
            />
            {formData.itemId === "" ? null : <><Inventory viewFromInvoice={true} itemId={Number(formData.itemId)} setNetWeight={setNetWeight} />
                <Form
                    title={"Invoice Details"}
                    children={

                        <div style={{ display: 'flex' }}>
                            <SelectComponent data={formData.wastePer} option={wastePer} name={"wastePer"} placeholder={"Enter wastage"} setFormData={setFormData} validationText={"Waste Percentage cannot be empty"} validator={validator.wastePer} />

                            <InputField labelName={"Total Weight"} value={
                                `${(((Number(formData.wastePer) / 100) * netWeight) + netWeight).toFixed(2)} gms`
                            } />
                        </div>
                    }
                />
                <div style={{ height: "10px" }}></div>
                <Form
                    title={"Invoice Details"}
                    children={<>

                        <div style={{ display: 'flex' }}>
                            <InputField labelName={"Gold price per gm"} inputValue={formData.goldPrice} setInputValue={setFormData} name={"goldPrice"} type={"number"} />
                            <InputField labelName={"Total item price"} value={getTotalItemPrice(formData)} />

                            <InputField labelName={"Making"} inputValue={formData.making} setInputValue={setFormData} name={"making"} type={"number"} />

                        </div>
                        <div style={{ height: "10px" }}></div>
                        <div style={{ display: 'flex' }}>
                            <InputField labelName={"Total bill"} value={getTotalBill(formData)} />
                        </div>
                    </>}
                />
                <Form
                    title={"Invoice Bill"}
                    children={<>

                        <div style={{ display: 'flex' }}>
                            <InputField labelName={"Qty"} inputValue={formData.qty} setInputValue={setFormData} name={"qty"} type={"number"} />
                            <InputField labelName={"final Bill"} value={getTotalBill(formData) * Number(formData.qty)} />
                        </div>
                        <div style={{ height: "10px" }}></div>

                    </>}
                /></>}
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to add invoice ?"} />
        </>
    )
}


