import React, { useState } from 'react'
import ContentHeader from '../../../components/contentHeader/ContentHeader'
import { useNavigate } from 'react-router'
import DataTable from '../../../components/common/table/DataTable'
import { karigarCols, karigarData } from '../../Karigar/view/KarigarData'
import Paginate from '../../../components/common/Paginate/Paginate';

export default function ViewCategory() {
    const navigate = useNavigate()
    const [data, setData] = useState([])


    const dataTransform = (dataForTable) => {
        const tempData = []
        for (var i = 0; i < dataForTable.length; i++) {
            const data2 = []
            data2.push(i + 1)
            data2.push(dataForTable[i].karigarName)
            tempData.push(data2)
        }
        //console.log("final Data")
        return tempData
    }
    return (
        <div>
            <ContentHeader titleName={"Karigars"} buttonName={"Add Karigar"} submitData={() => {
                navigate("/addkarigar")
            }} />
            <DataTable col={karigarCols} data={dataTransform(karigarData)} responseData={karigarData} />
            <Paginate />
        </div>
    )
}
