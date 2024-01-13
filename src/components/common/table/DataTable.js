import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';

import Button from 'react-bootstrap/Button'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import ModalComponent from '../../modal/ModalComponent';
import { getMessageFromAxiosError, makeRequest } from '../../../utils/HelperUtils';

export default function DataTable({ col, data, setData, responseData, navigate, path, url }) {
  const [id, setId] = useState("")
  const [index, setIndex] = useState(-1)
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(e => !e)
  }

  const deleteData = async () => {
    try {
      let response;
      console.log(`${url}/${id}`)
      response = await makeRequest("Delete", null, `${url}/${id}`)
      const temp = [...data]
      temp.splice(index, 1)
      setData(temp)
      alert(response.message)
    } catch (error) {
      alert(getMessageFromAxiosError(error))
    }
  }
  return (
    <>
      <Table responsive bordered>
        <thead>
          <tr>
            {col.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((value, index) => (
              <tr>
                {value.map(e =>
                  <td>
                    {
                      e.toString().includes("base64,") ? <img style={{
                        height: '60px',
                        width: "100%"
                      }} src={e} alt='' /> :
                        <div style={{ display: 'flex', }}>
                          <p>{e}</p>
                        </div>
                    }
                  </td>

                )

                }
                <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button variant="success" onClick={() => {
                    //console.log(responseData[index])
                    localStorage.setItem("update", JSON.stringify(responseData[index]))
                    navigate(path)
                  }}><FaEdit /></Button>
                  <div style={{ width: "10px" }}></div>
                  <Button variant="danger" onClick={() => {
                    setId(responseData[index]["categoryCode"])
                    setIndex(index)
                    handleModal()
                  }}><AiFillDelete /></Button>
                </td>
              </tr>
            ))
          }

        </tbody>
      </Table>
      <ModalComponent modal={modal} handleModal={handleModal} onSuccess={deleteData} bodyText={"Are you sure you want to delete Karigar?"} />
    </>
  );
}

