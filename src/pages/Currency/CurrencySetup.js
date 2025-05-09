import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import DataTable from '../../components/common/table/DataTable'
import Paginate from '../../components/common/Paginate/Paginate'
import { downloadReport, makeRequest } from '../../utils/HelperUtils'
import { useNavigate } from 'react-router'
import { currencyCols } from './CurrencyCols'
import SearchFilter from '../../components/common/SearchFilter/SearchFilter'
import ModalComponent from '../../components/modal/ModalComponent'

export default function CurrencySetup() {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [updatedData, setUpdatedData] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false)
    const [size, setSize] = useState(5)
    const [modal, setModal] = useState(false)
    const handleModal = () => {
        setModal(e => !e);
    }
    const dataTransform = (dataForTable) => {
        const tempData = []
        for (let i = 0; i < dataForTable.length; i++) {
            const data2 = []
            data2.push(i + 1)
            data2.push(dataForTable[i].currencyName)
            data2.push(dataForTable[i].description)
            tempData.push(data2)
        }
        //console.log("final Data")
        return tempData
    }
    const [search, setSearch] = useState("")
    const fetchData = async () => {
        setLoading(true)
        let data = `page=${page}&size=${size}`
        if (search.length > 0)
            data = data + `&search=currencyName=${search}`

        const response = await makeRequest("GET", null, `/currency?${data}`)
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

    }, [page, size])

    const generateReport = async () => {
        try {
            const response = await makeRequest("GET", null, "/report/detailedcurrencyreportpdf")
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
            <ContentHeader multiOption={true} titleName={"Currency Setup"} buttonName={"Add Currency"} submitData={() => {
                localStorage.removeItem('update')
                navigate("/addcurrency")
            }} multiName={
                [
                    {
                        name: "Generate Report",
                        method: handleModal,
                        color: ""
                    },
                    {
                        name: "Add Currency Transaction",
                        method: () => {
                            localStorage.removeItem('update')
                            navigate("/addcurrency")
                        },
                        color: 'red'
                    }
                ]
            } />
            <SearchFilter fetchData={fetchData} search={search} setSearch={setSearch} />
            <DataTable col={currencyCols} setData={setData} data={data} responseData={updatedData} url={"/currency/delete"} navigate={navigate} path={"/addcurrency"} />
            <Paginate page={page} size={size} setSize={setSize} pageCount={pageCount} setPage={setPage} />
            <ModalComponent bodyText={"Want to generate currency report?"} handleModal={handleModal}
                modal={modal} onSuccess={generateReport} />
        </div>

    )
}
