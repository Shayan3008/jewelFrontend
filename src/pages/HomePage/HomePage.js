import Sidebar from '../../components/sidebar/Sidebar'
import DataTable from '../../components/common/table/DataTable';
import { columns, dataForTable } from '../../constants/constantData';

import ContentHeader from '../../components/contentHeader/ContentHeader';
import 'react-dropdown/style.css';
import './HomePage.css'
import '../../utils/common.css'
import { useNavigate } from 'react-router';
import { makeRequest, navigateToPage } from '../../utils/HelperUtils';
import { useEffect, useState } from 'react';
import Paginate from '../../components/common/Paginate/Paginate';

export default function HomePage(props) {
    // TODO: Pick this from category metal api call.
    const [data, setData] = useState([])
    const [updatedData, setUpdatedData] = useState([])
    const [page, setPage] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const dataTransform = (dataForTable) => {
        const tempData = []
        for (var i = 0; i < dataForTable.length; i++) {
            const data2 = []
            data2.push(i + 1)
            data2.push(dataForTable[i].categoryName)
            data2.push(dataForTable[i].metalName)
            tempData.push(data2)
        }
        //console.log("final Data")
        return tempData
    }
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {

            const response = await makeRequest("GET", null, `/category?page=${page}&size=5`)
            if (response.statusCode === 200) {
                setUpdatedData(response.body)
                setPageCount(response.size / 5)
                const transformedData = dataTransform(response.body)
                setData(transformedData)
            }
        }

        fetchData()
    }, [])

    return (
        <div>
            <ContentHeader titleName={"Category"} buttonName={"Add Category"} submitData={() => {
                navigate("/addcategory")
            }} />
            <DataTable col={columns} data={data} responseData={updatedData} navigate={navigate} path={"/addcategory"} url={"/category/delete"} setData={setData}  />
            <Paginate setPage={setPage} pageCount={pageCount} />
        </div>

    )
}
