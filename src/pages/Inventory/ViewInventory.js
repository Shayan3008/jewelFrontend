import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import DataTable from '../../components/common/table/DataTable'
import { inventoryCols } from './InventoryCols'
import { makeRequest } from '../../utils/HelperUtils'
import ReactPaginate from 'react-paginate';


export default function ViewInventory() {
    const [pageCount, setPageCount] = useState(-1)
    const [currentPage, setCurrentPage] = useState(0)
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [updatedData, setUpdatedData] = useState([])

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
        //console.log("final Data")
        return tempData
    }

    useEffect(() => {
        const fetchData = async () => {

            const response = await makeRequest("GET", null, `/item?page=${currentPage}&size=5`)
            if (response.statusCode === 200) {
                console.log(response)
                setUpdatedData(response.body)
                setPageCount(response.size/5)
                const transformedData = dataTransform(response.body)
                setData(transformedData)
            }
        }

        fetchData()
        // console.table(dataTransform(karigarData))
        // setData(dataTransform(karigarData))
    }, [currentPage])
    return (
        <>

            <ContentHeader titleName={"Inventory"} buttonName={"Add Inventory"} submitData={() => {
                navigate("/addinventory")
            }} />
            <DataTable setData={setData} col={inventoryCols} data={data} responseData={updatedData} url={"/item/delete"} navigate={navigate} path={"/addinventory"} />
            <div>

                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={(e) => { console.log(e); setCurrentPage(e.selected) }}
                    pageRangeDisplayed={5}
                    pageCount={Math.ceil(pageCount)}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                />
            </div>
        </>
    )
}
