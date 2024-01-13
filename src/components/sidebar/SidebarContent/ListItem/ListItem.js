import React, { useState } from 'react'
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { Collapse } from 'react-collapse';

export default function ListItem({ item, renderList }) {
    const [collapse, setCollapse] = useState(false);

    return (
        <> <div className='list-item' onClick={() => {
            setCollapse(!collapse)
            //console.log(item)
        }} onKeyUp={() => { }}>
            <h4 style={{fontSize:'1.8rem'}}>{item.name}</h4>
            <div style={{ width: '5px' }}></div>
            {!collapse ? <FaAngleDown color='white' size={16} /> : <FaAngleRight color='white' size={16} />}
        </div>
            <div style={{ height: '0.5rem' }}></div>
            <Collapse seamless={true} style={{ display: 'flex' }} isOpened={collapse}>
                {/* Rendering child items if present */}
                {renderList(item.child)}
            </Collapse></>
    );
}
