import React, { useEffect, useState } from 'react'
import { getMessageFromAxiosError, handleImageChange, makeRequest, setAllMembersToFalse, validateFields, viewButton, viewOrEditHelper } from '../../utils/HelperUtils'
import "../../components/common/CommonInput.css";
import ContentHeader from '../../components/contentHeader/ContentHeader'
import InputField from '../../components/common/input/InputField';
import Form from '../../components/form/Form';
import ModalComponent from '../../components/modal/ModalComponent';
import '../../components/common/input/InputField.css'
import Select from 'react-dropdown-select';
import { Modal, Spinner } from 'react-bootstrap';
import SelectComponent from '../../components/common/Select/SelectComponent';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { apiUrl, headers } from '../../constants/enviourment';
import { goldPurity } from '../../constants/constantData';
import { fetchKarigarLOV } from '../../common/dropdown/Karigar';
import { useDispatch } from 'react-redux';
import { showDialog } from '../../store/Actions/MessageDialogAction';
export default function Inventory({ viewFromInvoice, itemId, setItem }) {
    let metalTypeArray = []
    const navigate = useNavigate()
    const [update, setUpdate] = useState(false)
    const [view, setView] = useState(false)
    const [loadItem, setLoadItem] = useState(false)
    const [hasDiamonds, setHasDiamonds] = useState(false)
    const dispatch = useDispatch()
    const [validator, setValidator] = useState({
        itemName: false,
        karat: false,
        designNo: false,
        netWeight: false,
        itemImage: false,
        karigarId: false,
        metalName: false,
        categoryId: false,
        qty: false,
        beedsWeight: false,
        bigStoneWeight: false,
        smallStoneQty: false,
        diamondQty: false,
        diamondWeight: false
    })
    const [formData, setFormData] = useState({

        itemName: "",
        karat: "",
        designNo: "",
        netWeight: 0.0,
        itemImage: null,
        karigarId: 0,
        metalName: "",
        categoryId: 0,
        description: "",
        qty: 1,
        beedsWeight: 0.0,
        bigStoneWeight: 0.0,
        smallStoneQty: 0,
        diamondQty: 0,
        diamondWeight: 0.0
    })
    const [metalType, setMetalType] = useState([])
    const [karigar, setKarigar] = useState([])
    const [modal, setModal] = useState(false)
    const [option, setOption] = useState([])
    const [category, setCategory] = useState([])
    const [numberArray, setNumberArray] = useState(Array.from({ length: 100 }, (_, index) => index + 1));


    const fetchCategories = (metalName, metalTypeArray) => {
        let selectedMetalType = metalTypeArray.find(e => e.metalName === metalName)
        if (selectedMetalType === undefined)
            return;
        let categories = []
        for (const element of selectedMetalType.categoryResponseDTOs) {
            const data = {}
            data.id = element.categoryCode;
            data.name = element.categoryName;
            categories.push(data)
        }
        setCategory(categories)
    }

    const validate = () => {
        const data = { ...validator }
        if (formData.categoryId === 0)
            data.categoryId = true
        if (formData.designNo.length === 0)
            data.designNo = true
        if (formData.karigarId === 0)
            data.karigarId = true
        if (formData.netWeight <= 0)
            data.netWeight = true
        if (formData.karat <= 0)
            data.karat = true
        return data
    }
    const handleModal = () => {
        const data = validate()

        const validated = validateFields(data, setValidator, validator)
        if (validated === false)
            return;

        setModal(e => !e)
    }

    const fetchData = async () => {
        try {
            const response = await makeRequest("GET", null, "/metalType");
            if (response.statusCode === 200) {
                const metalOptions = response.body.map(element => ({
                    id: element.metalName,
                    name: element.metalName
                }));
                metalTypeArray = response.body
                setOption(metalOptions);
                setMetalType(response.body);
            }
        } catch (error) {
            alert(getMessageFromAxiosError(error))
        }
    };
    const fetchKarigar = async () => {
        const karigars = await fetchKarigarLOV()
        console.log(karigars)
        if (karigars != null) {
            setKarigar(karigars)
        }
    };
    const loadFormData = async () => {

        await fetchData();
        await fetchKarigar();
        const numbers = numberArray.map(data => ({
            id: data,
            name: data
        }));
        setNumberArray(numbers);
        if (viewFromInvoice === true) {

            setLoadItem(true)
            const response = await makeRequest("GET", null, `/item/${itemId}`)
            if (response.statusCode === 200) {
                setFormData({
                    itemName: response.body.itemName,
                    karat: response.body.karat,
                    designNo: response.body.designNo,
                    netWeight: response.body.netWeight,
                    itemImage: response.body.itemImage,
                    karigarId: response.body.karigarId,
                    metalName: response.body.metalName,
                    categoryId: response.body.categoryId,
                    qty: response.body.qty,
                    wastePercent: 0,
                    description: response.body.description,
                    beedsWeight: response.body.beedsWeight,
                    bigStoneWeight: response.body.bigStoneWeight,
                    smallStoneQty: response.body.smallStoneQty,
                    diamondQty: response.body.diamondQty,
                    diamondWeight: response.body.diamondWeight
                })
                setItem(response.body)
                fetchCategories(response.body.metalName, metalTypeArray)
            }
            setLoadItem(false)

            return;
        }

        let inventoryData = viewOrEditHelper(setView, setUpdate)

        if (inventoryData !== null && inventoryData !== undefined) {
            setFormData({
                id: inventoryData.id,
                qty: inventoryData.qty,
                karat: inventoryData.karat,
                designNo: inventoryData.designNo,
                netWeight: inventoryData.netWeight,
                grossWeight: inventoryData.grossWeight,
                totalWeight: inventoryData.totalWeight,
                itemImage: inventoryData.itemImage,
                karigarId: inventoryData.karigarId,
                metalName: inventoryData.metalName,
                categoryId: inventoryData.categoryId,
                wastePercent: 0,
                description: inventoryData.description,
                beedsWeight: inventoryData.beedsWeight,
                bigStoneWeight: inventoryData.bigStoneWeight,
                smallStoneQty: inventoryData.smallStoneQty,
                diamondQty: inventoryData.diamondQty,
                diamondWeight: inventoryData.diamondWeight
            });
            setHasDiamonds(inventoryData.diamondQty !== 0)
            setUpdate(true);
        }

    };
    useEffect(() => {




        loadFormData();

    }, []);

    const fetchReport = async () => {
        const report = await axios.get(apiUrl + "/report/invoicereport/" + formData.id, {
            responseType: 'arraybuffer', headers: headers
        })

        if (report) {
            const binaryData = atob(report);

            // Create Uint8Array from binary data
            const uint8Array = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i = i + 12) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }
            const reportBlob = new Blob([uint8Array], { type: 'application/pdf' })
            const link = document.createElement("a")
            link.href = window.URL.createObjectURL(reportBlob);
            link.download = 'report.pdf';
            link.click();
        }
    }


    const submitData = async () => {
        try {

            let response = null;
            if (update === true) {
                response = await makeRequest("PUT", formData, "/item/update")
            } else {
                response = await makeRequest("POST", formData, "/item/save")
            }

            dispatch(showDialog(true, response.message, false))

        } catch (error) {
            dispatch(showDialog(true, getMessageFromAxiosError(error), false))
        }
        setTimeout(() => {
            dispatch(showDialog(false, "", false))
            navigate(-1)
        }, 3000);
    }

    console.table(formData)
    console.table(karigar)
    try {
        return loadItem === true ? <div style={{
            margin: '10px',
            textAlign: 'center'
        }}>
            <Spinner />
        </div> : (
    
            <>
    
                {viewFromInvoice ? null : <ContentHeader titleName={`${view ? 'view' : update ? 'Update' : 'Add'} Item`} buttonName={`${view ? 'View Report' : update ? 'Update' : 'Submit'}`} submitData={view ? fetchReport : handleModal} isView={viewButton()} />}
                <div style={{ height: '10px' }}></div>
                <Form
                    title={"item"}
                    children={
    
                        <div style={{ display: 'flex' }}>
                            <Select
                                disabled={viewFromInvoice || view}
                                className='input-container' style={{
                                    padding: '1rem',
                                    margin: '1rem',
                                    fontSize: '16px',
                                    border: '1px solid lightgray',
                                    borderRadius: '5px',
                                    outline: 'none',
                                    transition: 'all 1s ease',
                                    boxShadow: '0 6px 10px 0 rgba(0, 0, 0, 0.1)',
                                    width: '29vw'
    
                                }} placeholder='Enter metal name'
                                options={option}
                                values={option.length > 0 && formData.metalName
                                    ? [option.find(e => e.name === formData.metalName)]
                                    : []}
                                labelField="name"
                                valueField="id"
                                onChange={(values) => {
                                    setFormData(data => ({
                                        ...data,
                                        metalName: values[0].id,
                                        categoryId: ""
                                    }))
    
                                    fetchCategories(values[0].id, metalType)
                                }
                                } />
                            <SelectComponent disabled={viewFromInvoice || view} validator={validator.categoryId} data={formData.categoryId} option={category} placeholder={"Please Enter category"} setFormData={setFormData} validationText={"Please Select Category "} name={"categoryId"} />
    
                        </div>
                    }
                />
    
                <div style={{ height: "10px" }}></div>
                <Form
                    title={"Item details"}
                    children={<>
                        <div style={{ display: 'flex' }}>
    
                            <div>
                                <SelectComponent disabled={view || viewFromInvoice} data={formData.karat} name={"karat"} option={goldPurity} setFormData={setFormData} placeholder={"Enter Gold Purity"} validator={validator.karat} validationText={"Gold Purity must be selected."} />
                            </div>
    
                            <SelectComponent disabled={viewFromInvoice || view} data={formData.karigarId} name={"karigarId"} option={karigar} placeholder={"Enter Karigar"} setFormData={setFormData} validationText={"Please Select Karigar"} validator={validator.karigarId} />
    
                            <InputField labelName={"Design No"} disable={viewFromInvoice || view} inputValue={formData.designNo} setInputValue={setFormData} name={"designNo"} validator={validator.designNo} validationText={"Please Enter design no"} />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <InputField labelName={"Net Weight"} disable={viewFromInvoice || view} inputValue={formData.netWeight} type={"number"} setInputValue={setFormData} name={"netWeight"}
                                validationText={"Net Weight should be greater than 0"} validator={validator.netWeight} />
                            <InputField labelName={"Item Description"} disable={viewFromInvoice || view} inputValue={formData.description} setInputValue={setFormData} name={"description"} />
                            <InputField labelName={"qty"} disable={viewFromInvoice || view} inputValue={formData.qty} type={"number"} setInputValue={setFormData} name={"qty"}
                                validationText={"Qty should be greater than 0"} validator={validator.qty} />
    
                        </div>
    
    
                    </>}
                />
    
                <div style={{ height: "10px" }}></div>
    
                <Form
                    title={"Item weights"}
                    children={<>
                        <div style={{ display: 'flex' }}>
                            <InputField labelName={"Beeds Weight"} disable={viewFromInvoice || view} inputValue={formData.beedsWeight} type={"number"} setInputValue={setFormData} name={"beedsWeight"}
                                validationText={"beeds Weight should not be less than 0"} validator={validator.beedsWeight} />
                            <InputField labelName={"Big Stone Weight"} disable={viewFromInvoice || view} inputValue={formData.bigStoneWeight} type={"number"} setInputValue={setFormData} name={"bigStoneWeight"} validationText={"Big Stone Weight should not be less than 0"} validator={validator.bigStoneWeight} />
                            <InputField labelName={"Small Stone Qty"} disable={viewFromInvoice || view} inputValue={formData.smallStoneQty} type={"number"} setInputValue={setFormData} name={"smallStoneQty"}
                                validationText={"Small Stone Qty should not be less than 0"} validator={validator.smallStoneQty} />
                        </div>
                        <div style={{ height: '15px' }}></div>
                        {formData.metalName !== "Diamond" ? null : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    
                            <input type='checkbox' style={{ transform: 'scale(1.5)' }} value={hasDiamonds} onClick={(e) => { setHasDiamonds(e.target.checked) }} />
                            <div style={{ width: '10px' }}></div>
                            <h5 style={{ padding: 0, margin: 0 }}>Has Diamonds</h5>
                        </div>}
                        <div style={{ height: '15px' }}></div>
                        {hasDiamonds && <div style={{ display: 'flex' }}>
    
                            <InputField labelName={"Diamond Qty"} disable={viewFromInvoice || view} inputValue={formData.diamondQty} type={"number"} setInputValue={setFormData} name={"diamondQty"}
                                validationText={"Diamond Qty should not be less than 0"} validator={validator.diamondQty} />
                            <InputField labelName={"Diamond Weight"} disable={viewFromInvoice || view} inputValue={formData.diamondWeight} type={"number"} setInputValue={setFormData} name={"diamondWeight"}
                                validationText={"Diamond Weight should not be less than 0"} validator={validator.diamondWeight} />
                        </div>}
    
    
                    </>}
                />
                <div style={{ height: '10px' }}></div>
                <div >
    
                    <div style={{ display: "flex" }}>
                        <div style={{ width: "180px", height: "180px" }}>
    
                            {formData.itemImage ? <img src={`data:image/jpeg;base64,${formData.itemImage}`} alt="Preview" style={{ width: '100%', height: '100%' }} /> : <h5>
                                Image Preview</h5>}
                        </div>
                    </div>
    
                    {(!viewFromInvoice && !view) && <input type='file' style={{ width: "30%" }} accept="image/*" onChange={(e) => { handleImageChange(e, setFormData) }} alt='' />}
                </div>
                <div style={{ height: "10px" }}></div>
                <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to add item?"} />
            </>
        )
    } catch (error) {
        console.error("error in Inventory.js ",error)
    }

}
