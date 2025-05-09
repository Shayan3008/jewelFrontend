import React, { useEffect, useState } from 'react'
import { sideBarContent } from '../sidebarConstants'
import ListItem from './ListItem/ListItem'
import { Link } from 'react-router-dom';
export default function SidebarContent(props) {
    const [collapse, setCollapse] = useState(false);
    const [collapseList,setCollapseList] = useState([])
    useEffect(() => {

            const initialBooleanList = sideBarContent.map(() => false);
            setCollapseList(initialBooleanList);
    }, [])
    

    const renderList = (items) => {
        return (<>
            {items.map((item, index) => (
                <li key={index}>
                    {item.child ? <><ListItem item={item} renderList={renderList} collapse={collapseList} setCollapse={setCollapseList} index={index} /><div style={{height:'10px'}}></div></> :
                        <Link to={item.url} onClick={() => {
                            const temp = [...collapseList]
                            for(var i = 0; i < temp.length; i++){
                                temp[i] = false
                            }
                            setCollapseList(temp)
                            props.setOpenSideBar(0)
                        }}>

                            <h5
                                onKeyUp={() => { }}
                                style={{
                                    color: 'white',
                                    fontSize: '1.4em',
                                    paddingLeft: '1em'
                                }}
                            >
                                {item.name}
                            </h5>
                        </Link>}
                </li >
            ))
            }
        </>)
    }
    return (
        renderList(sideBarContent)
    )
}
