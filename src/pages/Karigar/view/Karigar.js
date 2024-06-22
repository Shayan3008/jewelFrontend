import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import ContentHeader from '../../../components/contentHeader/ContentHeader'
import DataTable from '../../../components/common/table/DataTable'
import { karigarCols } from './KarigarData'
import { makeRequest } from '../../../utils/HelperUtils'
import Paginate from '../../../components/common/Paginate/Paginate'
import { Spinner } from 'react-bootstrap'
import SearchFilter from '../../../components/common/SearchFilter/SearchFilter'

export default function Karigar() {
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
            data2.push(dataForTable[i].karigarName)
            tempData.push(data2)
        }
        //console.log("final Data")
        return tempData
    }

    const fetchData = async () => {
        setLoading(true)
        let data = ""
        if (search.length > 0) {
            data = `page=${page}&size=5&search=karigarName=${search}`
        }
        else {
            data = `page=${page}&size=5`
        }
        const response = await makeRequest("GET", null, `/karigar?${data}`)
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
            <ContentHeader titleName={"Karigars"} buttonName={"Add Karigar"} submitData={() => {
                localStorage.removeItem('update')
                navigate("/addkarigar")
            }} />
            <SearchFilter fetchData={fetchData} search={search} setSearch={setSearch} />
            <DataTable col={karigarCols} setData={setData} data={data} responseData={updatedData} url={"/karigar/delete"} navigate={navigate} path={"/addkarigar"} />
            <Paginate pageCount={pageCount} setPage={setPage} />
        </div>

    )
}
