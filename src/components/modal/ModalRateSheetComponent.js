import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import InputField from '../common/input/InputField';
import { rateChange } from '../../store/Actions/GoldRateAction';
import { showDialog } from '../../store/Actions/MessageDialogAction';

export default function ModalRateSheetComponent({ modal, handleModal, goldRate, setGoldRate, dispatch }) {
    return (
        <Modal size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered show={modal} onHide={handleModal}>
            <Modal.Header closeButton>
                <Modal.Title>Configure Gold Rate</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                textAlign: 'center'
            }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h5>Enter 24k Gold Rate</h5>
                        <InputField setInputValue={setGoldRate} inputValue={goldRate} name={"goldRate"} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h5>Enter 22k Gold Rate</h5>
                        <InputField value={(Number(goldRate) * (22 / 24)).toFixed(2).toString()} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h5>Enter 21k Gold Rate</h5>
                        <InputField value={(Number(goldRate) * (21 / 24)).toFixed(2).toString()} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h5>Enter 18k Gold Rate</h5>
                        <InputField value={(Number(goldRate) * (18 / 24)).toFixed(2).toString()} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => { handleModal() }}>
                    No
                </Button>
                <Button variant="success" onClick={() => {
                    dispatch(rateChange(goldRate))
                    dispatch(showDialog(true, "Gold Rate Configured", false))
                    setTimeout(() => {
                        dispatch(showDialog(false, "", false))
                    }, 4000);
                    handleModal()
                }}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
