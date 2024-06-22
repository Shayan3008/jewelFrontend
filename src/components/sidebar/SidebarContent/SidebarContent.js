import React from 'react'
import { sideBarContent } from '../sidebarConstants'
import ListItem from './ListItem/ListItem'
import { Link } from 'react-router-dom';
export default function SidebarContent(props) {

    const renderList = (items) => {
        return (<>
            {items.map((item, index) => (
                <li key={index}>
                    {item.child ? <><ListItem item={item} renderList={renderList} /><div style={{height:'10px'}}></div></> :
                        <Link to={item.url} onClick={() => {
                            props.setOpenSideBar(0)
                        }}>

                            <h5
                                onClick={() => console.log(item)}
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
