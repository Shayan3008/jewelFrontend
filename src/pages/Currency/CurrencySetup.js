import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import DataTable from '../../components/common/table/DataTable'
import Paginate from '../../components/common/Paginate/Paginate'
import { downloadReport, makeRequest } from '../../utils/HelperUtils'
import { useNavigate } from 'react-router'
import { currencyCols } from './CurrencyCols'

export default function CurrencySetup() {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [updatedData, setUpdatedData] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false)
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await makeRequest("GET", null, `/currency?page=${page}&size=5`)
            if (response.statusCode === 200) {
                setUpdatedData(response.body)
                const transformedData = dataTransform(response.body)
                setPageCount(response.size / 5)
                setData(transformedData)
            }
            setLoading(false)
        }

        fetchData()

    }, [page])

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
                        method: generateReport,
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
            <DataTable col={currencyCols} setData={setData} data={data} responseData={updatedData} url={"/currency/delete"} navigate={navigate} path={"/addcurrency"} />
            <Paginate pageCount={pageCount} setPage={setPage} />
        </div>

    )
}
