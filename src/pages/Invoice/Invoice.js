import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/contentHeader/ContentHeader';
import { useNavigate } from 'react-router';
import DataTable from '../../components/common/table/DataTable';
import { invoiceCols } from './InvoiceColumns';
import { makeRequest } from '../../utils/HelperUtils';
import Paginate from '../../components/common/Paginate/Paginate';
import { Spinner } from 'react-bootstrap';
import SearchFilter from '../../components/common/SearchFilter/SearchFilter';

export default function Invoice() {
  
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [updatedData, setUpdatedData] = useState([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [search, setSearch] = useState("")
  const dataTransform = (dataForTable) => {
    const tempData = []
    for (let i = 0; i < dataForTable.length; i++) {
      const data2 = []
      data2.push(i + 1)
      data2.push(dataForTable[i].categoryName == null ? "Sale without item" : dataForTable[i].categoryName)
      data2.push(dataForTable[i].itemResponseDTO == null ? "Sale without item" : dataForTable[i].itemResponseDTO.karigarName)
      data2.push(dataForTable[i].qty)
      data2.push((dataForTable[i].totalBill * dataForTable[i].qty))
      data2.push(new Date(dataForTable[i].invoiceDate).toDateString())
      tempData.push(data2)
    }
    //console.log("final Data")
    return tempData
  }

  const fetchData = async () => {
    setLoading(true)
    const response = await makeRequest("GET", null, `/invoice?page=${page}&size=5&search=${search}`)
    if (response.statusCode === 200) {
      console.log(response)
      setUpdatedData(response.body)
      console.log(response.size / 5)
      setPageCount(response.size / 5)
      const transformedData = dataTransform(response.body)
      setData(transformedData)
    }
    setLoading(false)
  }
  useEffect(() => {

    fetchData()
  }, [page])

  return loading === true ? <div style={{
    height: '50vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end'
  }}> <Spinner /> </div> : (
    <>
      <ContentHeader titleName={"Invoice"} buttonName={"Add Invoice"} submitData={() => {
        navigate("/addinvoice")
      }} />
      <div style={{ height: '10px' }}></div>
      <SearchFilter search={search} setSearch={setSearch} fetchData={fetchData} option={[]} />
      <DataTable setData={setData} col={invoiceCols} data={data} responseData={updatedData} url={"/item/delete"} navigate={navigate} path={"/addinvoice"} />
      <Paginate pageCount={pageCount} setPage={setPage} page={page} />
    </>
  )
}
