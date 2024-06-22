import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { downloadReport, makeRequest, viewButton } from '../../utils/HelperUtils'
import { Spinner } from 'react-bootstrap'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import DataTable from '../../components/common/table/DataTable'
import Paginate from '../../components/common/Paginate/Paginate'
import { currencyTransactionCols } from './CurrencyCols'
import SearchFilter from '../../components/common/SearchFilter/SearchFilter'

export default function CurrencyPage() {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [updatedData, setUpdatedData] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const dataTransform = (dataForTable) => {
        const tempData = []
        for (let i = 0; i < dataForTable.length; i++) {
            const data2 = []
            data2.push(i + 1)
            data2.push(dataForTable[i].currencyName)
            data2.push(dataForTable[i].trnType)
            data2.push(dataForTable[i].amount)
            data2.push(dataForTable[i].exchangeRate)
            data2.push(dataForTable[i].description)
            tempData.push(data2)
        }
        //console.log("final Data")
        return tempData
    }

    const fetchData = async () => {
        setLoading(true)
        let data = `page=${page}&size=5`
        if (search.length > 0) {
            data = data + `&search=currency.currencyName=${search},trnType=${search}`
        }
        const response = await makeRequest("GET", null, `/currencytransaction?${data}`)
        if (response.statusCode === 200) {
            setUpdatedData(response.body)
            const transformedData = dataTransform(response.body)
            setPageCount(response.size / 5)
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
        <div>
            <ContentHeader multiOption={true} titleName={"Currency Transaction"} multiName={
                [
                    {
                        name: "Add Currency Transaction",
                        method: () => {
                            localStorage.removeItem('update')
                            navigate("/addcurrencytransaction")
                        },
                        color: 'red'
                    }
                ]
            } />
            <SearchFilter fetchData={fetchData} search={search} setSearch={setSearch} />
            <DataTable col={currencyTransactionCols} setData={setData} data={data} responseData={updatedData} url={"/currencytransaction/delete"} navigate={navigate} path={"/addcurrencytransaction"} />
            <Paginate pageCount={pageCount} setPage={setPage} />
        </div>
    )
}
