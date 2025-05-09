import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/contentHeader/ContentHeader';
import { useNavigate } from 'react-router';
import DataTable from '../../components/common/table/DataTable';
import { invoiceCols } from './InvoiceColumns';
import { convertDateToCorrectFormat, getFilterKey, makeRequest } from '../../utils/HelperUtils';
import Paginate from '../../components/common/Paginate/Paginate';
import { Button, Spinner } from 'react-bootstrap';
import SearchFilter from '../../components/common/SearchFilter/SearchFilter';
import InputField from '../../components/common/input/InputField';

export default function Invoice() {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [updatedData, setUpdatedData] = useState([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [search, setSearch] = useState("")
  const [size,setSize] = useState(5)
  const [filter, setFilter] = useState({
    invoiceDateLess: "",
    invoiceDateGreater: ""
  })
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
    setFilter({
      invoiceDateLess: "",
      invoiceDateGreater: ""
    })
    const response = await makeRequest("GET", null, `/invoice?page=${page}&size=${size}&search=${search}`)
    if (response.statusCode === 200) {
      setUpdatedData(response.body)
      setPageCount(response.size / size)
      const transformedData = dataTransform(response.body)
      setData(transformedData)
    }
    setLoading(false)
  }
  const fetchDataFilter = async () => {
    setLoading(true)
    setSearch("")
    const dateLess = convertDateToCorrectFormat(filter.invoiceDateLess)
    const trnDateGreater = convertDateToCorrectFormat(filter.invoiceDateGreater)
    const data1 = { ...filter }
    data1.invoiceDateLess = dateLess
    data1.invoiceDateGreater = trnDateGreater

    const result = getFilterKey(data1)
    const response = await makeRequest("GET", null, `/invoice?page=${page}&size=${size}&search=""&filter=${result}`)
    if (response.statusCode === 200) {
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
  }, [page,size])

  return loading === true ? <div style={{
    height: '50vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end'
  }}> <Spinner /> </div> : (
    <>
      <ContentHeader titleName={"Invoice"} buttonName={"Add Invoice"} submitData={() => {
        navigate("/addinvoice")
        localStorage.removeItem("view")

      }} />
      <div style={{ height: '10px' }}></div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>

        <SearchFilter search={search} setSearch={setSearch} fetchData={fetchData} option={[]} />
        <InputField labelName={"Transaction Start date"} inputValue={filter.invoiceDateLess} setInputValue={setFilter} name={"invoiceDateLess"} type={"date"} />
        <InputField labelName={"Transaction End date"} inputValue={filter.invoiceDateGreater} setInputValue={setFilter} name={"invoiceDateGreater"} type={"date"} />
        <Button variant='success' onClick={fetchDataFilter}>Apply</Button>
      </div >
      <DataTable setData={setData} col={invoiceCols} data={data} responseData={updatedData} url={"/item/delete"} navigate={navigate} path={"/addinvoice"} />
      <Paginate pageCount={pageCount} setPage={setPage} page={page} size={size} setSize={setSize} />
    </>
  )
}
