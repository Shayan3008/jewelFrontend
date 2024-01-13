import { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import Sidebar from './components/sidebar/Sidebar';
import AddCategory from './pages/Category/AddCategory/AddCategory';
import AddSubCategory from './pages/Category/AddSubCategory/AddSubCategory';
import ViewSubCategory from './pages/ViewSubCategory/ViewSubCategory';
import Inventory from './pages/Inventory/Inventory';
import Login from './pages/Login/Login';
import Karigar from './pages/Karigar/view/Karigar';
import AddKarigar from './pages/Karigar/add/AddKarigar';
import ViewCategory from './pages/Category/view/ViewCategory';
import Register from './pages/Register/Register';
import ViewInventory from './pages/Inventory/ViewInventory';
import { IoLogOut } from "react-icons/io5";
import Invoice from './pages/Invoice/Invoice';
import AddInvoice from './pages/Invoice/AddInvoice';

function App() {
  const [openSideBar, setOpenSideBar] = useState(0)
  const [showNavBar, setShowNavBar] = useState(true);
  const [showLogoutBox, setShowLogoutBox] = useState(false);

  return (
    <BrowserRouter>
      {showNavBar === true && <Navbar setShowLogoutBox={setShowLogoutBox} setOpenSideBar={setOpenSideBar} />}
      <div style={{
        height: '100px',
        display: showLogoutBox ? 'block' : 'none',
        background: 'white',
        width: '200px',
        position: 'absolute',
        right: '10px',
        border: '1px solid black',
        top: '60px',
        transition: 'all 0.2s ease-out',
        borderRadius: '10px',
        opacity: showLogoutBox ? 1 : 0
      }}>
        <ul style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Link to={"/login"} onClick={() => setShowLogoutBox(false)} style={{ color: 'black', textDecoration: 'none' }}>
            <IoLogOut size={25} />
            Log Out
          </Link>

        </ul>
      </div>
      <div className={showNavBar ? 'main' : ''}>
        {showNavBar === true && < Sidebar setOpenSideBar={setOpenSideBar} openSideBar={openSideBar} />}
        <div className={showNavBar ? 'content' : ''}>
          <div className={showNavBar ? 'insideContent bg-color' : ''}>
            <Routes>
              <Route>
                <Route
                  path="*"
                  element={<Navigate to="/login" replace />}
                />
              </Route>
              <Route exact path="/login" element={<Login setShowNavBar={setShowNavBar} />} />
              <Route path="/register" element={<Register setShowNavBar={setShowNavBar} />} />
              <Route path="/home">
                <>
                  {/* <ContentHeader titleName={"Category"} buttonName={"Add Category"} submitData={null} />
                  <DataTable col={columns} data={dataForTable} /> */}
                </>
              </Route>

              <Route path='/category' element={<HomePage />} />
              <Route path='/viewcategory' element={<ViewCategory />} />
              <Route path='/addcategory' element={<AddCategory />} />
              <Route path='/subCategoryView' element={<ViewSubCategory />} />
              <Route path='/addsubcategory' element={<AddSubCategory />} />
              <Route path='/addinventory' element={<Inventory viewFromInvoice={false} />} />
              <Route path='/karigar' element={<Karigar />} />
              <Route path='/addkarigar' element={<AddKarigar />} />
              <Route path='/viewinventory' element={<ViewInventory />} />
              <Route path='/invoice' element={<Invoice />} />
              <Route path='/addinvoice' element={<AddInvoice />} />
            </Routes>
          </div>
        </div>
      </div >
    </BrowserRouter>

  );
}

export default App;
