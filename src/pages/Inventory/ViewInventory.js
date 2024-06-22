import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import DataTable from '../../components/common/table/DataTable'
import { inventoryCols } from './InventoryCols'
import { makeRequest } from '../../utils/HelperUtils'
import { Spinner } from 'react-bootstrap'
import SearchFilter from '../../components/common/SearchFilter/SearchFilter'
import Paginate from '../../components/common/Paginate/Paginate'


export default function ViewInventory() {
    const [pageCount, setPageCount] = useState(-1)
    const [currentPage, setCurrentPage] = useState(0)
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [updatedData, setUpdatedData] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const dataTransform = (dataForTable) => {
        const tempData = []
        for (let i = 0; i < dataForTable.length; i++) {
            const data2 = []
            data2.push(i + 1)
            data2.push(dataForTable[i].metalName)
            data2.push(dataForTable[i].categoryName)
            data2.push(dataForTable[i].karigarName)
            data2.push(`data:image/jpeg;base64,${dataForTable[i].itemImage}`)
            tempData.push(data2)
        }
        return tempData
    }

    const fetchData = async () => {
        setLoading(true)
        let data = `page=${currentPage}&size=5`
        if (search.length > 0) {
            data = data + `&search=metalType.metalName=${search},karigar.karigarName=${search},category.categoryName=${search}`
        }
        const response = await makeRequest("GET", null, `/item?${data}`)
        if (response.statusCode === 200) {
            setUpdatedData(response.body)
            setPageCount(response.size / 5)
            const transformedData = dataTransform(response.body)
            setData(transformedData)
        }
        setLoading(false)
    }

    useEffect(() => {


        fetchData()
        // console.table(dataTransform(karigarData))
        // setData(dataTransform(karigarData))
    }, [currentPage])
    return loading === true ? <div style={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'end'
    }}> <Spinner /> </div> : (
        <>

            <ContentHeader titleName={"Inventory"} buttonName={"Add Inventory"} submitData={() => {
                localStorage.removeItem("edit")
                localStorage.removeItem("view")
                navigate("/addinventory")
            }} />
            <div style={{ height: '10px' }}></div>
            <SearchFilter search={search} setSearch={setSearch} fetchData={fetchData} option={[]} />
            <DataTable setData={setData} col={inventoryCols} data={data} responseData={updatedData} url={"/item/delete"} navigate={navigate} path={"/addinventory"} />
            <Paginate pageCount={pageCount} setPage={setCurrentPage} page={currentPage} />
        </>
    )
}
