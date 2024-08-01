import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import Main from "./components/Layouts/Main";
import LoginPage from "./components/Login/LoginPage";

// Admin pages
import Home from "./pages/Home";
import AdminMember from "./pages/admin/Member";
import AdminCustomer from "./pages/admin/Customer";
import AdminProduct from "./pages/admin/Product";
import AdminApproval from "./pages/admin/Approval";
import AdminCategory from "./pages/admin/Category";
import AdminReview from "./pages/admin/Review";
import AdminStatistics from "./pages/admin/Statistics";

// Customer pages
import MemberManage from "./pages/customer/MemberManage";
import MemberManageDetail from "./pages/customer/MemberManageDetail";
import ProductGeneral from "./pages/customer/ProductGeneral";
import ProductGeneralDetail from "./pages/customer/ProductGeneralDetail";
import ProductEco from "./pages/customer/ProductEco";
import ProductEcoDetail from "./pages/customer/ProductEcoDetail";
import ProductTimeSale from "./pages/customer/ProductTimesale";
import ProductTimeSaleDetail from "./pages/customer/ProductTimeSaleDetail";
import ProductCreate from "./pages/customer/ProductCreate";
import OrderGeneral from "./pages/customer/OrderGeneral";
import OrderGeneralDetail from "./pages/customer/OrderGeneralDetail";
import OrderSubscription from "./pages/customer/OrderSubscription";
import OrderSubscriptionDetail from "./pages/customer/OrderSubscriptionDetail";
import Inventory from "./pages/customer/Inventory";
import InventoryDetail from "./pages/customer/InventoryDetail";
import CustomerSolution from "./pages/customer/Solution";
import Shipment from "./pages/customer/Shipment";
import ShipmentDetail from "./pages/customer/ShipmentDetail";
import Delivery from "./pages/customer/Delivery";
import Promotion from "./pages/customer/Promotion";
import { useFontSizeStore } from "./stores/fontSizeStore";
import { useEffect } from "react";
import useAuthStore from "./stores/useAuthStore";
import ProtectedRoute from "./components/Login/ProtectedRoute";

function App() {
  const { fontSize } = useFontSizeStore();
  const { initializeAuth, setupInterceptors } = useAuthStore();

  useEffect(() => {
    setupInterceptors();
    initializeAuth();
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <div className='app-root' style={{ fontSize: `${fontSize}` }}>
      <Routes>
        {/* 로그인 페이지 라우트 */}
        <Route path="/login" element={<LoginPage />} />

        <Route element={<Main />}>
          <Route 
            path='/' 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* Admin routes */}
          <Route path='/admin'>
            <Route path='member' element={<AdminMember />} />
            <Route path='customer' element={<AdminCustomer />} />
            <Route path='product' element={<AdminProduct />} />
            <Route path='approval' element={<AdminApproval />} />
            <Route path='category' element={<AdminCategory />} />
            <Route path='review' element={<AdminReview />} />
            <Route path='statistics' element={<AdminStatistics />} />
          </Route>

          {/* Customer routes */}
          <Route path='/member'>
            <Route path='manage' element={<MemberManage />} />
            <Route path='manage/:member_id' element={<MemberManageDetail />} />
          </Route>
          <Route path='/product'>
            <Route path='general' element={<ProductGeneral />} />
            <Route path='general/:productId' element={<ProductGeneralDetail />} />
            <Route path='eco' element={<ProductEco />} />
            <Route path='eco/:productId' element={<ProductEcoDetail />} />
            <Route path='timesale' element={<ProductTimeSale />} />
            <Route path='timesale/:timesaleId' element={<ProductTimeSaleDetail />} />
            <Route path='create' element={<ProductCreate />} />
          </Route>
          <Route path='/order'>
            <Route path='general' element={<OrderGeneral />} />
            <Route path='general/:orderDetailId' element={<OrderGeneralDetail />} />
            <Route path='subscription' element={<OrderSubscription />} />
            <Route path='subscription/:regularOrderId' element={<OrderSubscriptionDetail />} />
          </Route>
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/inventory/:productName' element={<InventoryDetail />} />
          <Route path='/solution' element={<CustomerSolution />} />
          <Route path='/shipment' element={<Shipment />} />
          <Route path='shipment/:orderDetailId' element={<ShipmentDetail />} />
          <Route path='/delivery' element={<Delivery />} />
          <Route path='/promotion' element={<Promotion />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
