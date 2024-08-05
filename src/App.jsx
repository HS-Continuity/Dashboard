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
import NotFound from "./pages/customer/NotFound";

import { useFontSizeStore } from "./stores/fontSizeStore";
import { useEffect } from "react";
import { useLargeCursorStore } from "./stores/largeCursorStore";

// 쉽게보기
import EasyMemberManage from "./pages/easyview/member/EasyMemberManage";
import EasyProductGeneral from "./pages/easyview/product/EasyProductGeneral";
import EasyStatistics from "./pages/easyview/statistics/EasyStatistics";

import EasyViewLayout from "./components/Easyview/layout/EasyViewLayout";
import useAuthStore from "./stores/useAuthStore";
import ProtectedRoute from "./components/Login/ProtectedRoute";
import EasyPromotion from "./pages/easyview/promotion/EasyPromotion";
import EasyProductEco from "./pages/easyview/product/EasyProductEco";
import EasyProductTimeSale from "./pages/easyview/product/EasyProductTimeSale";

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
            <Route
              path='member'
              element={
                <ProtectedRoute>
                  <AdminMember />
                </ProtectedRoute>
              }
            />
            <Route
              path='customer'
              element={
                <ProtectedRoute>
                  <AdminCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path='product'
              element={
                <ProtectedRoute>
                  <AdminProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path='approval'
              element={
                <ProtectedRoute>
                  <AdminApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path='category'
              element={
                <ProtectedRoute>
                  <AdminCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path='review'
              element={
                <ProtectedRoute>
                  <AdminReview />
                </ProtectedRoute>
              }
            />
            <Route
              path='statistics'
              element={
                <ProtectedRoute>
                  <AdminStatistics />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Customer routes */}
          <Route path='/member'>
            <Route
              index
              element={
                <ProtectedRoute>
                  <MemberManage />
                </ProtectedRoute>
              }
            />
            <Route
              path=':member_id'
              element={
                <ProtectedRoute>
                  <MemberManageDetail />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path='/product'>
            <Route
              path='general'
              element={
                <ProtectedRoute>
                  <ProductGeneral />
                </ProtectedRoute>
              }
            />
            <Route
              path='general/:productId'
              element={
                <ProtectedRoute>
                  <ProductGeneralDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='eco'
              element={
                <ProtectedRoute>
                  <ProductEco />
                </ProtectedRoute>
              }
            />
            <Route
              path='eco/:productId'
              element={
                <ProtectedRoute>
                  <ProductEcoDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='timesale'
              element={
                <ProtectedRoute>
                  <ProductTimeSale />
                </ProtectedRoute>
              }
            />
            <Route
              path='timesale/:timesaleId'
              element={
                <ProtectedRoute>
                  <ProductTimeSaleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='create'
              element={
                <ProtectedRoute>
                  <ProductCreate />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path='/order'>
            <Route
              path='general'
              element={
                <ProtectedRoute>
                  <OrderGeneral />
                </ProtectedRoute>
              }
            />
            <Route
              path='general/:orderDetailId'
              element={
                <ProtectedRoute>
                  <OrderGeneralDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='subscription'
              element={
                <ProtectedRoute>
                  <OrderSubscription />
                </ProtectedRoute>
              }
            />
            <Route
              path='subscription/:regularOrderId'
              element={
                <ProtectedRoute>
                  <OrderSubscriptionDetail />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path='/inventory'
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path='/inventory/:productName'
            element={
              <ProtectedRoute>
                <InventoryDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path='/statistics'
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route
            path='/shipment'
            element={
              <ProtectedRoute>
                <Shipment />
              </ProtectedRoute>
            }
          />
          <Route
            path='shipment/:orderDetailId'
            element={
              <ProtectedRoute>
                <ShipmentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path='/delivery'
            element={
              <ProtectedRoute>
                <Delivery />
              </ProtectedRoute>
            }
          />
          <Route
            path='/promotion'
            element={
              <ProtectedRoute>
                <Promotion />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 쉽게 보기 */}
        <Route path='/easy' element={<EasyViewLayout />}>
          <Route index element={<Home />} />
          <Route path='member'>
            <Route index element={<EasyMemberManage />} />
          </Route>
          <Route path='product'>
            <Route path='general' element={<EasyProductGeneral />} />
            <Route path='eco' element={<EasyProductEco />} />
            <Route path='timesale' element={<EasyProductTimeSale />} />
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
          <Route path='statistics' element={<EasyStatistics />} />
          <Route path='delivery' element={<Delivery />} />
          <Route path='promotion' element={<EasyPromotion />} />
        </Route>

        <Route path='/' element={<Main />} />
        {/* 허용되지 않은 URL */}
        <Route path='*' element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
