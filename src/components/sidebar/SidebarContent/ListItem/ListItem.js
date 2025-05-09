import React from 'react'
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { Collapse } from 'react-collapse';

export default function ListItem({ item, renderList, setCollapse, collapse, index }) {
    return (
        <> <div style={{ cursor: "pointer" }} className='list-item' onClick={() => {
            const tempList = [...collapse]
            for (var i = 0; i < tempList.length; i++) {
                if (i !== index) {
                    tempList[i] = false
                }
            }
            tempList[index] = !tempList[index]
            setCollapse(tempList)
        }} onKeyUp={() => { }}>
            <h4 style={{ fontSize: '1.8rem' }}>{item.name}</h4>
            <div style={{ width: '5px' }}></div>
            {!collapse[index] ? <FaAngleDown color='white' size={16} /> : <FaAngleRight color='white' size={16} />}
        </div>
            <div style={{ height: '0.5rem' }}></div>
            <Collapse seamless={true} style={{ display: 'flex' }} isOpened={collapse[index]}>
                {renderList(item.child)}
            </Collapse></>
    );
}
