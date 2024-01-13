import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';

export default function ModalComponent({ modal, handleModal, onSuccess, bodyText }) {

    const [showLoader, setShowLoader] = useState(false)
    return (

        <Modal size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered show={modal} onHide={handleModal}>
            <Modal.Header closeButton>
                <Modal.Title>{showLoader === true ? null : "Modal heading"}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={showLoader === true ? {
                textAlign: 'center'
            } : null}>{showLoader === true ? <Spinner style={{ textAlign: 'center' }} animation="border" variant="info" /> : bodyText}</Modal.Body>
            {showLoader === true ? null : <Modal.Footer>
                <Button variant="danger" onClick={handleModal}>
                    No
                </Button>
                <Button variant="success" onClick={async () => {
                    setShowLoader(true)
                    await onSuccess();
                    setShowLoader(false)
                    handleModal();
                }}>
                    Yes
                </Button>
            </Modal.Footer>}
        </Modal>


    );
}
