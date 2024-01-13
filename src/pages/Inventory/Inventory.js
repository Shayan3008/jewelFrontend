import React, { useEffect, useState } from 'react'
import { checkIfAnyFalse, getMessageFromAxiosError, makeRequest, setAllMembersToFalse } from '../../utils/HelperUtils'
import "../../components/common/CommonInput.css";
import ContentHeader from '../../components/contentHeader/ContentHeader'
import InputField from '../../components/common/input/InputField';
import Form from '../../components/form/Form';
import ModalComponent from '../../components/modal/ModalComponent';
import '../../components/common/input/InputField.css'
import Select from 'react-dropdown-select';
import { Spinner } from 'react-bootstrap';
import SelectComponent from '../../components/common/Select/SelectComponent';
import { useNavigate } from 'react-router';
export default function Inventory({ viewFromInvoice, itemId, setNetWeight }) {
    let metalTypeArray = []
    const navigate = useNavigate()
    const [update, setUpdate] = useState(false)
    const [loadItem, setLoadItem] = useState(false)
    const [validator, setValidator] = useState({
        itemName: false,
        karat: false,
        designNo: false,
        netWeight: false,
        itemImage: false,
        karigarId: false,
        metalName: false,
        categoryId: false
    })
    const [formData, setFormData] = useState({

        itemName: "",
        karat: 0,
        designNo: "",
        netWeight: 0.0,
        itemImage: null,
        karigarId: 0,
        metalName: "",
        categoryId: 0,
    })
    const [metalType, setMetalType] = useState([])
    const [karigar, setKarigar] = useState([])
    const [modal, setModal] = useState(false)
    const [option, setOption] = useState([])
    const [category, setCategory] = useState([])
    const [numberArray, setNumberArray] = useState(Array.from({ length: 100 }, (_, index) => index + 1));

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (reader.readyState === 2) {
                    //console.log(event.target.result)
                    setFormData((data) => ({
                        ...data,
                        itemImage: event.target.result.split(",")[1]
                    }))
                }

            };
            reader.readAsDataURL(selectedImage);
        }
    };
    const fetchCategories = (metalName, metalTypeArray) => {
        console.log("Inside fetch Categories")
        let selectedMetalType = metalTypeArray.find(e => e.metalName === metalName)
        console.log(selectedMetalType)
        if (selectedMetalType === undefined)
            return;
        let categories = []
        for (const element of selectedMetalType.categoryResponseDTOs) {
            const data = {}
            data.id = element.categoryCode;
            data.name = element.categoryName;
            categories.push(data)
        }
        console.log(categories)
        setCategory(categories)
    }
    const handleModal = () => {
        //console.log(modal)
        setModal(e => !e)
    }

    useEffect(() => {
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
                console.error("Error fetching metal types:", error);
            }
        };

        const fetchKarigar = async () => {
            try {
                const response = await makeRequest("GET", null, "/karigar");
                if (response.statusCode === 200) {
                    const karigars = response.body.map(element => ({
                        id: element.id,
                        name: element.karigarName
                    }));
                    setKarigar(karigars);
                }

                const numbers = numberArray.map(data => ({
                    id: data,
                    name: data
                }));
                setNumberArray(numbers);
            } catch (error) {
                console.error("Error fetching karigars:", error);
            }
        };

        const loadFormData = async () => {

            await fetchData();
            await fetchKarigar();
            if (viewFromInvoice === true) {
                setLoadItem(true)
                const response = await makeRequest("GET", null, `/item/${itemId}`)
                // console.log(response)
                if (response.statusCode === 200) {
                    setFormData({
                        itemName: response.body.itemName,
                        karat: response.body.karat,
                        designNo: response.body.designNo,
                        netWeight: response.body.netWeight,
                        itemImage: response.body.itemImage,
                        karigarId: response.body.karigarId,
                        metalName: response.body.metalName,
                        categoryId: response.body.categoryId
                    })
                    setNetWeight(response.body.netWeight)
                    fetchCategories(response.body.metalName, metalTypeArray)
                }
                setLoadItem(false)

                return;
            }
            const inventoryData = JSON.parse(localStorage.getItem("update"));
            if (inventoryData) {
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
                    wastePercent: 0
                });
                setUpdate(true);
            }

        };

        loadFormData();

    }, [itemId]);



    const submitData = async () => {
        try {
            const data = { ...validator }
            if (formData.categoryId === 0)
                data.categoryId = true
            if (formData.designNo.length < 4)
                data.designNo = true
            if (formData.karigarId === 0)
                data.karigarId = true
            if (formData.netWeight <= 0)
                data.netWeight = true
            if (formData.karat <= 0)
                data.karat = true
            if (checkIfAnyFalse(data)) {
                setValidator(data)
                setTimeout(() => {
                    const data = setAllMembersToFalse(validator)
                    setValidator(data)
                }, 5000);
                return;
            }
            if (update === true) {
                const response = await makeRequest("PUT", formData, "/item/update")
                alert(response.message)
            } else {
                const response = await makeRequest("POST", formData, "/item/save")

                alert(response.message)
            }

            navigate(-1)

        } catch (error) {
            alert(getMessageFromAxiosError(error))
        }
    }
    return loadItem === true ? <div style={{
        margin: '10px',
        textAlign: 'center'
    }}>
        <Spinner />
    </div> : (

        <>

            {viewFromInvoice ? null : <ContentHeader titleName={`${update ? 'Update' : 'Add'} Item`} buttonName={`${update ? 'Update' : 'Submit'}`} submitData={handleModal} />}
            <Form
                title={"item"}
                children={

                    <div style={{ display: 'flex' }}>
                        <Select
                            disabled={viewFromInvoice}
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
                                console.log(values)
                                setFormData(data => ({
                                    ...data,
                                    metalName: values[0].id,
                                    categoryId: ""
                                }))

                                fetchCategories(values[0].id, metalType)
                            }
                            } />
                        <SelectComponent disabled={viewFromInvoice} validator={validator.categoryId} data={formData.categoryId} option={category} placeholder={"Please Enter category"} setFormData={setFormData} validationText={"Please Select Category "} name={"categoryId"} />

                    </div>
                }
            />

            <div style={{ height: "10px" }}></div>
            <Form
                title={"Item details"}
                children={<>
                    <div style={{ display: 'flex' }}>
                        <InputField labelName={"karat"} inputValue={formData.karat} setInputValue={setFormData} name={"karat"} disable={viewFromInvoice} type={"number"} validationText={"Karat should be greater than 0"} validator={validator.karat} />
                        <SelectComponent disabled={viewFromInvoice} data={formData.karigarId} name={"karigarId"} option={karigar} placeholder={"Enter Karigar"} setFormData={setFormData} validationText={"Please Select Karigar"} validator={validator.karigarId} />
                        <InputField labelName={"Design No"} disable={viewFromInvoice} inputValue={formData.designNo} setInputValue={setFormData} name={"designNo"} validator={validator.designNo} validationText={"Please Enter design no"} />
                    </div>
                    <div style={{ display: 'flex' }}>
                        <InputField labelName={"Net Weight"} disable={viewFromInvoice} inputValue={formData.netWeight} type={"number"} setInputValue={setFormData} name={"netWeight"}
                            validationText={"Net Weight should be greater than 0"} validator={validator.netWeight} />
                    </div>


                </>}
            />

            <div style={{ height: "10px" }}></div>
            <div >

                <div style={{ display: "flex" }}>
                    <div style={{ width: "180px", height: "180px" }}>

                        {formData.itemImage ? <img src={`data:image/jpeg;base64,${formData.itemImage}`} alt="Preview" style={{ width: '100%', height: '100%' }} /> : <h5>
                            Image Preview</h5>}
                    </div>
                </div>

                {!viewFromInvoice && <input type='file' style={{ width: "30%" }} accept="image/*" onChange={handleImageChange} alt='' />}
            </div>
            <div style={{ height: "10px" }}></div>
            <ModalComponent modal={modal} handleModal={handleModal} onSuccess={submitData} bodyText={"Are you sure you want to add item?"} />
        </>
    )
}
