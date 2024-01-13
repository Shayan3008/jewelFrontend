import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/contentHeader/ContentHeader';
import { useNavigate } from 'react-router';
import DataTable from '../../components/common/table/DataTable';
import { invoiceCols } from './InvoiceColumns';
import { makeRequest } from '../../utils/HelperUtils';
import Paginate from '../../components/common/Paginate/Paginate';

export default function Invoice() {
  const navigate = useNavigate()

  const [data, setData] = useState([])
  const [updatedData, setUpdatedData] = useState([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const dataTransform = (dataForTable) => {
    const tempData = []
    for (let i = 0; i < dataForTable.length; i++) {
      const data2 = []
      data2.push(i + 1)
      data2.push(dataForTable[i].categoryName)
      data2.push(dataForTable[i].qty)
      data2.push((dataForTable[i].totalBill * dataForTable[i].qty))
      data2.push(new Date(dataForTable[i].invoiceDate).toDateString())
      tempData.push(data2)
    }
    //console.log("final Data")
    return tempData
  }

  useEffect(() => {
    const fetchData = async () => {

      const response = await makeRequest("GET", null, `/invoice?page=${page}&size=5`)
      if (response.statusCode === 200) {
        console.log(response)
        setUpdatedData(response.body)
        setPageCount(response.size / 5)
        const transformedData = dataTransform(response.body)
        setData(transformedData)
      }
    }

    fetchData()
  }, [page])

  return (
    <>
      <ContentHeader titleName={"Invoice"} buttonName={"Add Invoice"} submitData={() => {
        navigate("/addinvoice")
      }} />
      <DataTable setData={setData} col={invoiceCols} data={data} responseData={updatedData} url={"/item/delete"} navigate={navigate} path={"/addinventory"} />
      <Paginate pageCount={pageCount} setPage={setPage} />
    </>
  )
}
