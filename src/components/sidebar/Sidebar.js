import { useState } from 'react';
import SidebarContent from './SidebarContent/SidebarContent';
import './sidebar.css';
export default function Sidebar(props) {
    const [menuName, setMenuName] = useState("Menu")
    const sideBarStyle = {
        width: `${props.openSideBar}px`,
        backgroundColor: "rgb(34,71,87)",
        height: "90%",
        transition: "all 0.5s",
        overflow: "hidden",
        position: "absolute",
        zIndex: 1
    };
    return (

        <div className='sidebar' style={sideBarStyle}>
            <h2 style={{ padding: '1rem', textAlign: 'center', color: 'white', margin: 0 }} >
                {menuName}
            </h2>
            <ul>
                <SidebarContent setOpenSideBar={props.setOpenSideBar} setMenuName={setMenuName} />
            </ul>
        </div >
    )
}
