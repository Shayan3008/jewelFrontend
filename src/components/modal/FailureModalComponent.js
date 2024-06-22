import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function FailureModalComponent({ modal, handleFailedModal, handleModal }) {
    return (
        <Modal size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered show={modal} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Error!! Gold Rate Not Configured</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                textAlign: 'center'
            }}>
                <h5>Rate not entered!!! Please Configure rate first.</h5>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => {
                    handleFailedModal()

                }}>
                    Cancel
                </Button>
                <Button variant="success" onClick={() => {
                    handleFailedModal()
                    handleModal()
                }}>
                    Configure Modal
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
