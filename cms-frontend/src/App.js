import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserHome from "./pages/User/UserHome";
import MenuPage from "./pages/User/MenuPage";
import CartPage from "./pages/User/CartPage";
import CheckoutPage from "./pages/User/CheckoutPage";
import AdminHome from "./pages/Admin/AdminHome";
import AdminInventory from "./pages/Admin/AdminInventory";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminMenuPage from "./pages/Admin/AdminMenuPage";
import AddInventoryPage from "./pages/Admin/AddInventoryPage";
import SuccessPage from "./pages/User/SuccessPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* User */}
        <Route path="/user" element={<UserHome />} />
        <Route path="/user/menu" element={<MenuPage />} />
        <Route path="/user/cart" element={<CartPage />} />
        <Route path="/user/checkout" element={<CheckoutPage />} />
        <Route path="/user/success" element={<SuccessPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/add-menu" element={<AdminMenuPage />} />
<Route path="/admin/add-inventory" element={<AddInventoryPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
