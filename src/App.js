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
import CashBook from './pages/CashBook/CashBook';
import CurrencyPage from './pages/Currency/CurrencyPage';
import CurrencySetup from './pages/Currency/CurrencySetup';
import AddCurrency from './pages/Currency/AddCurrency';
import AddCurrencyTransaction from './pages/Currency/AddCurrencyTransaction';
import CurrencyTransactionReport from './pages/Reports/CurrencyTransactionReport';
import ModalRateSheetComponent from './components/modal/ModalRateSheetComponent';
import FailureModalComponent from './components/modal/FailureModalComponent';
import GoldPurchase from './pages/GoldPurchase/GoldPurchase';
import { useSelector, useDispatch } from 'react-redux';
import AddVendor from './pages/Vendor/AddVendor';
import ViewVendor from './pages/Vendor/ViewVendor';
import JournalVoucher from './pages/JournalVoucher/JournalVoucher';
import VendorHeaderListing from './pages/VendorHeader/VendorHeaderListing';
import AddVendorHeader from './pages/VendorHeader/AddVendorHeader';
import LedgerReport from './pages/Reports/LedgerReport';


function App() {
  const selector = useSelector(state => state.goldRateReducer.goldRate)
  const dialogSelector = useSelector(state => state.dialogMessageReducer)
  const dispatch = useDispatch()

  const [openSideBar, setOpenSideBar] = useState(0)
  const [showNavBar, setShowNavBar] = useState(true);
  const [showLogoutBox, setShowLogoutBox] = useState(false);
  const [goldRate, setGoldRate] = useState({
    goldRate: 0
  })
  const [modal, setModal] = useState(false)
  const [failedModal, setFailedModal] = useState(false)
  const handleModal = () => {
    setModal(e => !e)
  }

  const handleFailedModal = () => {
    setFailedModal(e => !e)
  }
  return (
    <BrowserRouter>
      {dialogSelector.dialog === true ? <div style={
        dialogSelector.isError === true ? {
          "height": "98px",
          "position": "absolute",
          // "width": "250px",
          "background": "#ff9a9a",
          "right": "1px",
          "top": "2px",
          "zIndex": "1",
          "borderRadius": "10px",
          "display": "flex",
          "justifyContent": "center",
          "alignItems": "center",
          "color": "white",
          "fontSize": "1.2rem",
          "fontFamily": "monospace",
          "padding": "30px"

        } :
          {
            "height": "98px",
            "position": "absolute",
            // "width": "250px",
            "background": "rgb(37, 180, 145)",
            "right": "1px",
            "top": "2px",
            "zIndex": "1",
            "borderRadius": "10px",
            "display": "flex",
            "justifyContent": "center",
            "alignItems": "center",
            "color": "white",
            "fontSize": "1.2rem",
            "fontFamily": "monospace",
            "padding": "30px"

          }}>{dialogSelector.message}</div> : null
      }
      {showNavBar === true && <Navbar setShowLogoutBox={setShowLogoutBox} setOpenSideBar={setOpenSideBar} goldRate={selector} handleFailedModal={handleFailedModal} handleModal={handleModal} />}
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
              <Route path='/cashbook' element={<CashBook />} />
              <Route path='/currency' element={<CurrencyPage />} />
              <Route path='/currencysetup' element={<CurrencySetup />} />
              <Route path='/addcurrency' element={<AddCurrency />} />
              <Route path='/addcurrencytransaction' element={<AddCurrencyTransaction />} />
              <Route path='/currencytransaction' element={<CurrencyTransactionReport />} />
              <Route path='/goldpurchase' element={<GoldPurchase />} />
              <Route path='/viewvendor' element={<ViewVendor />} />
              <Route path='/addvendor' element={<AddVendor />} />
              <Route path='/purchasevoucher' element={<GoldPurchase />} />
              <Route path='/journalvoucher' element={<JournalVoucher />} />
              <Route path='/cashbookreport' element={<CurrencyTransactionReport />} />
              <Route path='/vendorheader' element={<VendorHeaderListing />} />
              <Route path='/savevendorheader' element={<AddVendorHeader />} />
              <Route path='/trialbalancereport' element={<LedgerReport />} />
            </Routes>
          </div>
        </div>
      </div >

      <ModalRateSheetComponent goldRate={goldRate.goldRate} setGoldRate={setGoldRate} handleModal={handleModal} modal={modal} dispatch={dispatch} />
      <FailureModalComponent modal={failedModal} handleFailedModal={handleFailedModal} handleModal={handleModal} />
    </BrowserRouter >

  );
}

export default App;
