import React, { useCallback, useEffect, useState } from 'react'
import SearchFilter from '../../components/common/SearchFilter/SearchFilter'
import DataTable from '../../components/common/table/DataTable'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import { Spinner } from 'react-bootstrap'
import { cashBookCols } from './CashBookCols'
import { makeRequest } from '../../utils/HelperUtils'
import FilteredSelect from '../../components/common/FilteredSelect/FilteredSelect'
import InputField from '../../components/common/input/InputField'

export default function CashBook() {

  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({
    transactionType: "",
    date: ""
  })
  const [filtered, setFiltered] = useState("")
  const [data, setData] = useState([])
  const [transactionTypes, setTransactionTypes] = useState([
    {
      id: "SALE",
      name: "SALE"
    },
    {
      id: "PURCHASE",
      name: "PURCHASE"
    }
  ])

  const dataTransform = (dataForTable) => {
    const tempData = []
    for (let i = 0; i < dataForTable.length; i++) {
      const data2 = []
      data2.push(i + 1)
      data2.push(dataForTable[i].amount)
      data2.push(dataForTable[i].trnDate.split("T")[0])
      data2.push(dataForTable[i].trnType)
      tempData.push(data2)
    }
    return tempData
  }

  const fetchData = useCallback(async () => {
    console.log("Fetch Data")
    const response = await makeRequest("GET", null, `/cashbook?filter=${filtered}`)
    if (response.statusCode === 200) {
      const transformedData = dataTransform(response.body)
      console.log(transformedData)
      setData(transformedData)
    }
  }, [filtered])

  useEffect(() => {
    fetchData()
  }, [fetchData])


  return (
    loading === true ? <div style={{
      height: '50vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'end'
    }}> <Spinner /> </div> : (
      <>

        <ContentHeader titleName={"CashBook"} buttonName={""} submitData={() => { }} />
        <div style={{ height: '10px' }}></div>

        <SearchFilter filterDropDown={<>
          <h5>
            Transaction Type
          </h5>
          <FilteredSelect option={transactionTypes} name={"transactionType"} setFilters={setFilter} placeholder={"Select transaction type."} />
          <div style={{ height: '10px' }}></div>
          <InputField labelName={"Invoice date"} inputValue={filter.date} setInputValue={setFilter} name={"date"} type={"date"} />
        </>} filter={filter} fetchData={fetchData} setFilter={setFiltered} />
        <DataTable col={cashBookCols} data={data} />
        {/* <Paginate pageCount={pageCount} setPage={setPage} /> */}
      </>
    ))
}
