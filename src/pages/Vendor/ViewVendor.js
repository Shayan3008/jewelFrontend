import React, { useEffect, useState } from 'react'
import { getMessageFromAxiosError, makeRequest } from '../../utils/HelperUtils'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import DataTable from '../../components/common/table/DataTable'
import { VendorCols } from './VendorCols'
import { Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import Paginate from '../../components/common/Paginate/Paginate'
import SearchFilter from '../../components/common/SearchFilter/SearchFilter'


export default function ViewVendor() {
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
            data2.push(dataForTable[i].vendorName)
            tempData.push(data2)
        }
        //console.log("final Data")
        return tempData
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            
            let data = ""
            if (search.length > 0) {
                data = `page=${page}&size=5&search=name=${search}`
            }
            else {
                data = `page=${page}&size=5`
            }
            const response = await makeRequest("GET", null, `/vendor?${data}`)
            if (response.statusCode === 200) {
                setUpdatedData(response.body)
                const transformedData = dataTransform(response.body)
                setPageCount(response.size / 5)
                setData(transformedData)
            }
        } catch (error) {
            getMessageFromAxiosError(error)
        }
        setLoading(false)
    }
    useEffect(() => {

        fetchData()
        // console.table(dataTransform(karigarData))
        // setData(dataTransform(karigarData))
    }, [page])


    return loading === true ? <div style={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'end'
    }}> <Spinner /> </div> : (
        <div>
            <ContentHeader titleName={"Vendors"} buttonName={"Add Vendor"} submitData={() => {
                localStorage.removeItem('update')
                navigate("/addvendor")
            }} />
            <SearchFilter fetchData={fetchData} search={search} setSearch={setSearch} />
            <DataTable col={VendorCols} setData={setData} data={data} responseData={updatedData} url={"/vendor/delete"} navigate={navigate} path={"/addvendor"} />
            <Paginate pageCount={pageCount} setPage={setPage} page={page}/>
        </div>

    )
}
