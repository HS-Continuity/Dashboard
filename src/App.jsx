import { Route, Routes, useLocation } from "react-router-dom";
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
import Statistics from "./pages/customer/Statistics";
import Shipment from "./pages/customer/Shipment";
import ShipmentDetail from "./pages/customer/ShipmentDetail";
import Delivery from "./pages/customer/Delivery";
import Promotion from "./pages/customer/Promotion";
import { useFontSizeStore } from "./stores/fontSizeStore";
import { useEffect } from "react";
import { useLargeCursorStore } from "./stores/largeCursorStore";

// 쉽게보기
import EasyMemberManage from "./pages/easyview/EasyMemberManage";
// import EasyMemberDetail from "./pages/easyview/EasyMemberDetail";
import EasyProductGeneral from "./pages/easyview/EasyProductGeneral";
import EasyViewLayout from "./components/Easyview/layout/EasyViewLayout";
import useAuthStore from "./stores/useAuthStore";
import ProtectedRoute from "./components/Login/ProtectedRoute";

function App() {
  const { fontSize } = useFontSizeStore();
  const location = useLocation();
  const { setIsLargeCursor } = useLargeCursorStore();
  const { initializeAuth, setupInterceptors } = useAuthStore();

  useEffect(() => {
    setupInterceptors();
    initializeAuth();
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    // '/easy' 경로를 벗어나면 큰 커서 상태를 초기화
    if (!location.pathname.startsWith("/easy")) {
      setIsLargeCursor(false);
    }
  }, [location.pathname, setIsLargeCursor]);

  return (
    <div className='app-root'>
      <Routes>
        {/* 로그인 페이지 라우트 */}
        <Route path='/login' element={<LoginPage />} />

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
            <Route index element={<MemberManage />} />
            <Route path=':member_id' element={<MemberManageDetail />} />
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
          <Route path='/statistics' element={<Statistics />} />
          <Route path='/shipment' element={<Shipment />} />
          <Route path='shipment/:orderDetailId' element={<ShipmentDetail />} />
          <Route path='/delivery' element={<Delivery />} />
          <Route path='/promotion' element={<Promotion />} />
        </Route>

        {/* 쉽게 보기 */}
        <Route path='/easy' element={<EasyViewLayout />}>
          <Route index element={<Home />} />
          <Route path='member'>
            <Route index element={<EasyMemberManage />} />
          </Route>
          <Route path='product'>
            <Route path='general' element={<ProductGeneral />} />
            <Route path='general/:productId' element={<ProductGeneralDetail />} />
            <Route path='eco' element={<ProductEco />} />
            <Route path='eco/:productId' element={<ProductEcoDetail />} />
            <Route path='timesale' element={<ProductTimeSale />} />
            <Route path='timesale/:timesaleId' element={<ProductTimeSaleDetail />} />
            <Route path='create' element={<ProductCreate />} />
          </Route>

          <Route path='order'>
            <Route path='general' element={<OrderGeneral />} />
            <Route path='generalDetail' element={<OrderGeneralDetail />} />
            <Route path='subscription' element={<OrderSubscription />} />
            <Route path='subscriptionDetail' element={<OrderSubscriptionDetail />} />
          </Route>

          <Route path='inventory' element={<Inventory />} />
          <Route path='inventory/:productName' element={<InventoryDetail />} />
          {/* <Route path='inventory/*' element={<Inventory />} /> */}
          <Route path='statistics' element={<Statistics />} />
          <Route path='delivery' element={<Delivery />} />
          <Route path='promotion' element={<Promotion />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
