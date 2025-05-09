import React from 'react'
import { Button, Modal } from 'react-bootstrap';

export default function ImageModal({ modal, handleModal,image }) {
    return (

        <Modal size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered show={modal} onHide={handleModal}>
            <Modal.Body ><img style={{height:"50vh",width:"100%"}} src={`data:image/jpeg;base64,${image}`} alt=""/></Modal.Body>
            {<Modal.Footer>
                <Button variant="danger" onClick={handleModal}>
                    close
                </Button>
            </Modal.Footer>}
        </Modal>
    )
}
