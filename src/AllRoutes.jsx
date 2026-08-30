import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Books from "./Pages/Books";
import Stationery from "./Pages/Stationery";
import Categories from "./Pages/Categories";
import CategoryBooks from "./Pages/CategoryBooks";
import Cart from "./Pages/Cart";
import Profile from "./Pages/Profile";

import Login from "./Pages/Login";
import Register from "./Pages/Register";

import AdminLogin from "./Admin/AdminLogin";
import AdminRegister from "./Pages/AdminRegister";
import AdminLayout from "./Admin/AdminLayout";
import AdminDashBoard from "./Admin/AdminDashBoard";
import AdminAddProducts from "./Admin/AdminAddProducts";
import AdminProducts from "./Admin/AdminProducts";
import AdminUpdateProducts from "./Admin/AdminUpdateProducts";
import AdminOrders from "./Admin/AdminOrders";
import AdminUsers from "./Admin/AdminUsers";
import AdminCategories from "./Admin/AdminCategories";
import AdminReports from "./Admin/AdminReports";
import AdminSettings from "./Admin/AdminSettings";

const AllRoutes = () => {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/home"
        element={<Home />}
      />

      <Route
        path="/books"
        element={<Books />}
      />

      <Route
        path="/stationery"
        element={<Stationery />}
      />

      <Route
        path="/categories"
        element={<Categories />}
      />

      <Route
        path="/category/:category"
        element={<CategoryBooks />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/register"
        element={<AdminRegister />}
      />

      <Route
        element={<AdminLayout />}
      >
        <Route
          path="/admin/dashboard"
          element={<AdminDashBoard />}
        />

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin/add-products"
          element={<AdminAddProducts />}
        />

        <Route
          path="/admin/update-products/:id"
          element={<AdminUpdateProducts />}
        />

        <Route
          path="/admin/edit-products/:id"
          element={<AdminUpdateProducts />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
          path="/admin/categories"
          element={<AdminCategories />}
        />

        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />

        <Route
          path="/admin/settings"
          element={<AdminSettings />}
        />
      </Route>

      <Route
        path="*"
        element={
          <div
            style={{
              textAlign: "center",
              padding: "100px",
            }}
          >
            <h1>404</h1>
            <h2>Page Not Found</h2>
          </div>
        }
      />

    </Routes>
  );
};

export default AllRoutes;
