import React from 'react'
import Form from '../../../components/form/Form'
import InputField from '../../../components/common/input/InputField'

export default function InvoiceDetailsComponent({ view, formData, wastePer, setFormData, validator, getTotalBill, rate }) {
    return (
        <div>
            <Form
                title={"Invoice Payment Details"}
                children={<>

                    {/* <div style={{ display: 'flex' }}>
                        {view ? <InputField disable={view} labelName={"Gold price per gm"} value={Number(formData.totalItemPrice) / calculateTotalWeight()} />
                            :
                            <InputField labelName={"Gold price per gm"} inputValue={formData.goldRate} setInputValue={setFormData} name={"goldRate"} type={"number"} />
                        }
                        <InputField disable={view} labelName={"Total item price"} value={getTotalItemPrice(formData)} />
                        <InputField disable={view} labelName={"Beads Amount"} inputValue={formData.beadAmount} setInputValue={setFormData} name={"beadAmount"} type={"number"} />

                    </div> */}
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
