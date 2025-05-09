import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { makeRequest } from '../../../utils/HelperUtils'
import { Spinner } from 'react-bootstrap'
import ContentHeader from '../../../components/contentHeader/ContentHeader'
import SearchFilter from '../../../components/common/SearchFilter/SearchFilter'
import DataTable from '../../../components/common/table/DataTable'
import Paginate from '../../../components/common/Paginate/Paginate'
import { metalTypeCols } from './MetalTypeCols'

export default function ViewMetalType() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [updatedData, setUpdatedData] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const [size, setSize] = useState(5)
  const dataTransform = (dataForTable) => {
    const tempData = []
    for (let i = 0; i < dataForTable.length; i++) {
      const data2 = []
      data2.push(i + 1)
      data2.push(dataForTable[i].metalName)
      tempData.push(data2)
    }
    //console.log("final Data")
    return tempData
  }

  const fetchData = async () => {
    setLoading(true)
    let data = ""
    if (search.length > 0) {
      data = `page=${page}&size=${size}&search=metalName=${search}`
    }
    else {
      data = `page=${page}&size=${size}`
    }
    const response = await makeRequest("GET", null, `/metalType/list?${data}`)
    if (response.statusCode === 200) {
      setUpdatedData(response.body)
      const transformedData = dataTransform(response.body)
      setPageCount(response.size / size)
      setData(transformedData)
    }
    setLoading(false)
  }
  useEffect(() => {

    fetchData()
  }, [page, size])


  return loading === true ? <div style={{
    height: '50vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end'
  }}> <Spinner /> </div> : (
    <div>
      <ContentHeader titleName={"View Metal Type"} buttonName={"Add Metal Type"} submitData={() => {
        localStorage.removeItem('view')
        localStorage.removeItem('update')
        navigate("/addmetaltype")
      }} />
      <SearchFilter fetchData={fetchData} search={search} setSearch={setSearch} />
      <DataTable col={metalTypeCols} setData={setData} data={data} responseData={updatedData} url={"/metalType/delete"} navigate={navigate} path={"/addmetaltype"}
        name={"metalName"} />
      <Paginate pageCount={pageCount} setPage={setPage} page={page} size={size} setSize={setSize} />
    </div>

  )
}
