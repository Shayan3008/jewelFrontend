import React from 'react'
import Inventory from '../../Inventory/Inventory'
import Form from '../../../components/form/Form'
import SelectComponent from '../../../components/common/Select/SelectComponent'
import InputField from '../../../components/common/input/InputField'

export default function InvoiceWithItem({ view, formData, wastePer, setFormData, validator, getTotalBill, item, setItem, getTotalItemPrice, calculateTotalWeight,saleWithoutPay,setLoad }) {

    try {
        return (
            <>
                <Inventory viewFromInvoice={true} setLoad={setLoad} itemId={Number(formData.itemId)} setItem={setItem} />
                <Form
                    title={"Invoice Details"}
                    children={
                        <>
                            <div style={{ display: 'flex' }}>
                                <SelectComponent disabled={view} data={formData.wastePer} option={wastePer} name={"wastePer"} placeholder={"Enter wastage"} setFormData={setFormData} validationText={"Waste Percentage cannot be empty"} validator={validator.wastePer} />

                                {calculateItemWeight(item, view, formData)}

                                <InputField disable={view || item.qty === 1} labelName={"Qty"} inputValue={formData.qty} setInputValue={setFormData} name={"qty"} type={"number"} max={
                                    Number(item.qty) > 1 ? Number(item.qty) : 1
                                } validator={validator.qty} validationText={"Total purchased item Qty cannot be zero Or greater than total item"} />

                            </div>
                            <div style={{ height: '10px' }}></div>
                            <div style={{ display: 'flex' }}>
                                <InputField disable={view} labelName={"Total Item Qty"} value={
                                    item.totalQty
                                } />
                                <InputField disable={view} labelName={"Total Weight"} value={
                                    `${calculateTotalWeight()} gms`
                                } />

                                <InputField disable={view} labelName={"Starting item Weight"} value={
                                    `${item.multiItem === null ? item.netWeight : item.totalMultiWeight} gms`
                                } />
                                {formData.currentGoldPrice > 0 ? <InputField disable={view} labelName={"Current gold price"} value={formData.currentGoldPrice} /> : null}
                            </div>

                        </>
                    }
                />
                <div style={{ height: "10px" }}></div>
                <Form
                    title={"Invoice Payment Details"}
                    children={<>

                        <div style={{ display: 'flex' }}>
                            {view ? <InputField disable={view} labelName={"Gold price per gm"} value={formData.goldRate === null ? 0 : formData.goldRate} />
                                :
                                <InputField disable={saleWithoutPay} labelName={"Gold price per gm"} inputValue={formData.goldRate} setInputValue={setFormData} name={"goldRate"} type={"number"} />
                            }
                            <InputField disable={view} labelName={"Total item price"} value={getTotalItemPrice(formData)} />
                            <InputField disable={view} labelName={"Beads Amount"} inputValue={formData.beadAmount} setInputValue={setFormData} name={"beadAmount"} type={"number"} />

                        </div>
                        <div style={{ height: "10px" }}></div>
                        <div style={{ display: 'flex' }}>
                            <InputField disable={view} labelName={"Big Stone Amount"} inputValue={formData.bigStoneAmount} setInputValue={setFormData} name={"bigStoneAmount"} type={"number"} />
                            <InputField disable={view} labelName={"Small Stone Amount"} inputValue={formData.smallStoneAmount} setInputValue={setFormData} name={"smallStoneAmount"} type={"number"} />
                            <InputField disable={view} labelName={"Doli polish"} inputValue={formData.doliPolish} setInputValue={setFormData} name={"doliPolish"} type={"number"} />
                        </div>
                        <div style={{ height: "10px" }}></div>
                        <div style={{ display: 'flex' }}>
                            <InputField disable={view} labelName={"Diamond Amount"} inputValue={formData.diamondAmount} setInputValue={setFormData} name={"diamondAmount"} type={"number"} />
                            <InputField disable={view} labelName={"Chandi Amount"} inputValue={formData.chandiAmount} setInputValue={setFormData} name={"chandiAmount"} type={"number"} />
                            <InputField disable={view} labelName={"Discount"} inputValue={formData.discount} setInputValue={setFormData} name={"discount"} type={"number"} />
                        </div>
                        <div style={{ height: '10px' }}></div>
                        <div style={{ display: 'flex' }}>
                            <InputField disable={view} labelName={"Diamond Rate"} inputValue={formData.diamondRate} setInputValue={setFormData} name={"diamondRate"} type={"number"} />
                            <InputField disable={view} labelName={"Making"} inputValue={formData.making} setInputValue={setFormData} name={"making"} type={"number"} />
                            <InputField disable={view} labelName={"Total bill"} value={getTotalBill(formData)} />
                        </div>
                    </>}
                />
                <Form
                    title={"Invoice Bill"}
                    children={<>

                        <div style={{ display: 'flex' }}>
                            {/* <InputField disable={view} labelName={"Qty"} inputValue={formData.qty} setInputValue={setFormData} name={"qty"} type={"number"} /> */}
                            <InputField disable={view} labelName={"final Bill"} value={getTotalBill(formData)} />
                        </div>
                        <div style={{ height: "10px" }}></div>

                    </>}
                /></>
        )
    } catch (error) {
        console.error("Error in InvoiceWithItem.js", error)
    }

}
function calculateItemWeight(item, view, formData) {

    if(view === true){
        let itemWeight = (item.netWeight / item.totalQty) * formData.qty 
        return <InputField disable={view} labelName={"Item Weight"} value={itemWeight} />
    }
    let wastePer = (Number(formData.wastePer) / 100)
    let netWeight = (Number(item.netWeight) / Number(item.qty)) * Number(formData.qty) 
    if (item.qty > 1)
        return <InputField disable={view} labelName={"Item Weight"}
            value={Number(formData.qty) <= Number(item.qty) ? netWeight : "Purchased qty cannot be greater than total no of items."} />

    let totalWeight = 0
    totalWeight = (Number(item.remainingNetWeight) * wastePer + Number(item.remainingNetWeight)).toFixed(2)
    console.log(item)
    return <InputField disable={view} labelName={"Item Weight"} value={totalWeight} />

}

