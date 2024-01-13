import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import ContentHeader from '../../components/contentHeader/ContentHeader'
import DataTable from '../../components/common/table/DataTable'
import { subCategoryColumns } from '../../components/common/constData/SubCategoryListing'
import { apiUrl, headers } from '../../constants/enviourment'
import axios from 'axios'

export default function ViewSubCategory() {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const tempData = []
    const dataTransform = (dataForTable) => {
        for (var i = 0; i < dataForTable.length; i++) {
            const data2 = []
            data2.push(i)
            data2.push(dataForTable[i].categoryName)
            data2.push(dataForTable[i].metalName)
            tempData.push(data2)
        }
        //console.log("final Data")
        return tempData
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(apiUrl + "/subcategory", {
                headers: headers
            })
            if (response.status === 200) {

                const dataTransformed = dataTransform(response.data)
                setData(dataTransformed)
            }
        }
        fetchData()
    }, [])


    return (
        <>

            <ContentHeader titleName={"Category"} buttonName={"Add Category"} submitData={() => {
                navigate("/addcategory")
            }} />
            <DataTable col={subCategoryColumns} data={data} />
        </>
    )
}
