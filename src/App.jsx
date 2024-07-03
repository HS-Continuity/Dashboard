import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./components/layouts/Main";

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
import MemberAddress from "./pages/customer/MemberAddress";
import MemberPayment from "./pages/customer/MemberPayment";
import ProductGeneral from "./pages/customer/ProductGeneral";
import ProductEco from "./pages/customer/ProductEco";
import ProductTimesale from "./pages/customer/ProductTimesale";
import OrderGeneral from "./pages/customer/OrderGeneral";
import OrderSubscription from "./pages/customer/OrderSubscription";
import Inventory from "./pages/customer/Inventory";
import CustomerSolution from "./pages/customer/Solution";
import Delivery from "./pages/customer/Delivery";
import Promotion from "./pages/customer/Promotion";

function App() {
  return (
    <Routes>
      <Route element={<Main />}>
        <Route path="/" element={<Home />} />

        {/* Admin routes */}
        <Route path="/admin">
          <Route path="member" element={<AdminMember />} />
          <Route path="customer" element={<AdminCustomer />} />
          <Route path="product" element={<AdminProduct />} />
          <Route path="approval" element={<AdminApproval />} />
          <Route path="category" element={<AdminCategory />} />
          <Route path="review" element={<AdminReview />} />
          <Route path="statistics" element={<AdminStatistics />} />
        </Route>

        {/* Customer routes */}
        <Route path="/member">
          <Route path="manage" element={<MemberManage />} />
          <Route path="address" element={<MemberAddress />} />
          <Route path="payment" element={<MemberPayment />} />
        </Route>
        <Route path="/product">
          <Route path="general" element={<ProductGeneral />} />
          <Route path="eco" element={<ProductEco />} />
          <Route path="timesale" element={<ProductTimesale />} />
        </Route>
        <Route path="/order">
          <Route path="general" element={<OrderGeneral />} />
          <Route path="subscription" element={<OrderSubscription />} />
        </Route>
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/solution" element={<CustomerSolution />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/promotion" element={<Promotion />} />
      </Route>
    </Routes>
  );
}

export default App;
