import React from 'react'
import Form from '../../../components/form/Form'
import SelectComponent from '../../../components/common/Select/SelectComponent'
import InputField from '../../../components/common/input/InputField'
import { goldPurity } from '../../../constants/constantData'
import { goldRate } from '../../../utils/HelperUtils'

export default function InvoiceWithoutItem({ view, formData, wastePer, setFormData, validator, getTotalBill, rate,saleWithoutPay }) {

    console.log(formData)
    function calculateTotalWeight() {
        // Means That invoice is already created and only needs to be seen.
        if (view === true) {
            return formData.totalWeight
        }
        console.log(Number(formData.netWeight))
        return (((Number(formData.wastePer) / 100) * Number(formData.netWeight)) + Number(formData.netWeight)).toFixed(2);
    }

    const getTotalItemPrice = (formData) => {
        if (view === true) {
            return formData.totalItemPrice
        }
        return (goldRate(formData.goldPurity, formData.goldRate) * calculateTotalWeight()).toFixed(2);
    }
    return (
        <div>
            <Form
                title={"Item details"}
                children={
                    <>

                        <div style={{ display: 'flex' }}>
                            <SelectComponent disabled={view} data={formData.wastePer} option={wastePer} name={"wastePer"} placeholder={"Enter wastage"} setFormData={setFormData} validationText={"Waste Percentage cannot be empty"} validator={validator.wastePer} />


                            <InputField disable={view} labelName={"Net Weight"} inputValue={formData.netWeight} setInputValue={setFormData} name={"netWeight"} type={"number"} />

                            <InputField disable={view} labelName={"Total Weight"} value={
                                `${calculateTotalWeight()} gms`
                            } />

                        </div>
                        <div style={{ height: '10px' }}></div>
                        <div style={{ display: 'flex' }}>
                            <InputField disable={view} labelName={"Qty"} value={
                                formData.qty
                            } />

                            {view ? null : <div>
                                <SelectComponent data={formData.goldPurity} name={"goldPurity"} option={goldPurity} setFormData={setFormData} placeholder={"Enter Gold Purity"} validator={validator.goldPurity} validationText={"Gold Purity must be selected."} />
                            </div>}
                        </div>
                    </>

                }
            />
            <div style={{ height: "10px" }}></div>
            <Form
                title={"Invoice Payment Details"}
                children={<>

                    <div style={{ display: 'flex' }}>
                        {view ? <InputField disable={view} labelName={"Gold price per gm"} value={Number(formData.totalItemPrice) / calculateTotalWeight()} />
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

                        <InputField disable={view} labelName={"final Bill"} value={getTotalBill(formData) * Number(formData.qty)} />
                    </div>
                    <div style={{ height: "10px" }}></div>

                </>}
            />
        </div>
    )
}
