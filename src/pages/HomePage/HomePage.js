
import DataTable from '../../components/common/table/DataTable';
import { columns } from '../../constants/constantData';

import ContentHeader from '../../components/contentHeader/ContentHeader';
import 'react-dropdown/style.css';
import './HomePage.css'
import '../../utils/common.css'
import { useNavigate } from 'react-router';
import { downloadReport, makeRequest } from '../../utils/HelperUtils';
import { useEffect, useState } from 'react';
import Paginate from '../../components/common/Paginate/Paginate';
import { Spinner } from 'react-bootstrap';
import SearchFilter from '../../components/common/SearchFilter/SearchFilter';
import ModalComponent from '../../components/modal/ModalComponent';

export default function HomePage() {
    // eslint-disable-next-line
    const [option, setOption] = useState([])
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [updatedData, setUpdatedData] = useState([])
    const [page, setPage] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [search, setSearch] = useState("")
    const [modal, setModal] = useState(false)

  const [size,setSize] = useState(5)
    const handleModal = () => {
        setModal(e => !e)
    }


    const dataTransform = (dataForTable) => {
        const tempData = []
        for (let i = 0; i < dataForTable.length; i++) {
            const data2 = []
            data2.push(i + 1)
            data2.push(dataForTable[i].categoryName)
            data2.push(dataForTable[i].metalName)
            tempData.push(data2)
        }
        //console.log("final Data")
        return tempData
    }

    const fetchData = async () => {
        setLoading(true)
        let data = ""
        if (search.length > 0)
            data = `page=${page}&size=${size}&search=${search}`
        else
            data = `page=${page}&size=${size}`
        const response = await makeRequest("GET", null, `/category?${data}`)
        if (response.statusCode === 200) {
            setUpdatedData(response.body)
            setPageCount(response.size / size)
            const transformedData = dataTransform(response.body)
            setData(transformedData)
        }
        setLoading(false)
    }


    
    const navigate = useNavigate()

    useEffect(() => {


        fetchData()
        // eslint-disable-next-line
    }, [page,size])

    const generateReport = async () => {
        try {
            const response = await makeRequest("GET", null, "/report/categorycompletereport")
            if (response.status === "Success") {
                downloadReport(response, "pdf", "Detailed_Currency_Report")
            }

        } catch (error) {
            console.log(error)
        }
    }

    return loading === true ? <div style={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'end'
    }}> <Spinner /> </div> : (
        <div>
            <ContentHeader multiOption={true} titleName={"Category"} multiName={
                [
                    {
                        name: "Generate Report",
                        method: handleModal,
                        color: ""
                    },
                    {
                        name: "Add Category",
                        method: () => {
                            localStorage.removeItem('update')
                            localStorage.removeItem("view")
                            navigate("/addcategory")
                        },
                        color: 'red'
                    }
                ]
            } />
            <SearchFilter fetchData={fetchData} search={search} setSearch={setSearch} option={option} />
            <DataTable col={columns} data={data} responseData={updatedData} navigate={navigate} path={"/addcategory"} url={"/category/delete"} setData={setData} name={"categoryCode"} />
            <Paginate setPage={setPage} pageCount={pageCount} page={page} size={size} setSize={setSize} />
            <ModalComponent bodyText={"Want to generate detailed category report?"} handleModal={handleModal}
                modal={modal} onSuccess={generateReport} />
        </div >

    )
}
