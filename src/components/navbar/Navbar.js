import './navbar.css'
import { GiHamburgerMenu } from "react-icons/gi";
import { GrConfigure } from "react-icons/gr";
import { FaUser } from "react-icons/fa";

export default function Navbar(props) {
    return (
        <div className='navbar'>
            <div className='parent'>
                <div className='child1'>
                    <div className='logo'>
                        <h1 style={{ margin: 0, fontFamily: 'Arvo' }}>New Real Jewelers</h1>
                    </div>
                    <div className='sideopen'>
                        <div style={{display:'flex'}}>

                            <button onClick={() => {
                                console.log(props.goldRate)
                                if(Number(props.goldRate) === 0){
                                    props.handleFailedModal()
                                    return;
                                }
                                props.setOpenSideBar(e => e === 0 ? 250 : 0)
                            }} style={{ background: 'rgb(138 183 138)', border: 'none', cursor: 'pointer' }}>
                                <GiHamburgerMenu size={20} color='white' />
                            </button>
                            <div style={{width:'5px'}}></div>
                            <button onClick={() => {
                                props.handleModal()
                            }} style={{ background: 'rgb(138 183 138)', border: 'none', cursor: 'pointer' }}>
                                <GrConfigure size={20} color='white' />
                            </button>
                        </div>
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
