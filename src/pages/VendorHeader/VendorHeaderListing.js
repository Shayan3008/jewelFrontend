import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getMessageFromAxiosError, makeRequest } from '../../utils/HelperUtils'
import { Spinner } from 'react-bootstrap'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import SearchFilter from '../../components/common/SearchFilter/SearchFilter'
import DataTable from '../../components/common/table/DataTable'
import Paginate from '../../components/common/Paginate/Paginate'
import { vendorHeaderCols } from './VendorHeaderCols'

export default function VendorHeaderListing() {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [updatedData, setUpdatedData] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const dataTransform = (data) => {
        const tempData = []
        for (let i = 0; i < data.length; i++) {
            const data2 = []
            data2.push(i + 1)
            data2.push(data[i].name)
            data2.push(data[i].description)
            tempData.push(data2)
        }
        return tempData
    }
    const fetchData = async () => {
        setLoading(true)
        try {

            let data = ""
            if (search.length > 0) {
                data = `page=${page}&size=5&search=name=${search},description=${search}`
            }
            else {
                data = `page=${page}&size=5`
            }
            const response = await makeRequest("GET", null, `/vendor-header?${data}`)
            if (response.statusCode === 200) {
                console.log(response)
                setUpdatedData(response.body)
                const transformedData = dataTransform(response.body)
                setPageCount(response.size / 5)
                setData(transformedData)
            }
        } catch (error) {
            console.log(error)
            getMessageFromAxiosError(error)
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
            <ContentHeader titleName={"Vendor Headers"} buttonName={"Add Vendor Header"} submitData={() => {
                localStorage.removeItem('update')
                navigate("/savevendorheader")
            }} />
            <SearchFilter fetchData={fetchData} search={search} setSearch={setSearch} />
            <DataTable col={vendorHeaderCols} setData={setData} data={data} responseData={updatedData} url={"/vendor-header/delete"} navigate={navigate} path={"/savevendorheader"} />
            <Paginate pageCount={pageCount} setPage={setPage} />
        </div>
    )
}
