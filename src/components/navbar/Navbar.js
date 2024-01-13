import './navbar.css'
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser } from "react-icons/fa";

export default function Navbar(props) {
    return (
        <div className='navbar'>
            <div className='parent'>
                <div className='child1'>
                    <div className='logo'>
                        <h1 style={{ margin: 0, fontFamily: 'Arvo' }}>Real jewelers</h1>
                    </div>
                    <div className='sideopen'>
                        <button onClick={() => {
                            props.setOpenSideBar(e => e === 0 ? 250 : 0)
                        }} style={{ background: 'rgb(138 183 138)', border: 'none', cursor: 'pointer' }}>
                            <GiHamburgerMenu size={20} color='white' />
                        </button>
                    </div>
                </div>
                <div className='child2'>
                    <div>
                        <FaUser size={20} />
                    </div>
                    <div style={{ width: '5px' }}></div>
                    <div onClick={() => {
                        props.setShowLogoutBox(e => !e)
                    }} role='button'>
                        <p>Shayan ali</p>
                    </div>
                    <div style={{ width: '5px' }}></div>
                </div>
            </div>
        </div>
    )

}
