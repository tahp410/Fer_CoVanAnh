import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Register from "./components/Register";
import AccessDenied from "./components/AccessDenied";
import "./components/style.css";
import "./components/css/GlobalStyles.css";
import "./components/css/Style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import ProductUser from "./components/ProductUser";
import StoreRules from "./hooks/StoreRules";
import { Term } from "./hooks/Term";
import ViewProfile from "./components/ViewProfile";
import OrderTracking from "./components/OrderTracking";
import VerifyOrder from "./components/verifyOrder";
import AnswerQuestion from "./hooks/AnswerQuestion";
import Cart from "./components/Cart";
import ProductDetail from "./components/ProductDetail";
import ProductAdmin from "./components/ProductAdmin";
import ChangePassword from "./components/ChangePassword";
import OrderManagement from "./components/OrderManagement";
import UserManagement from "./components/UserManagement";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem("accounts"));
    if (accounts) setIsLogin(true);
  }, []);

  return (
    <ThemeProvider>
      <div style={{ overflow: "hidden" }}>
        {" "}
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth/login"
              element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />}
            />
            <Route
              path="/auth/register"
              element={
                <>
                  {" "}
                  <Header /> <Register />
                </>
              }
            />
            <Route
              path="/view-profile"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <ViewProfile isLogin={isLogin} />
                </>
              }
            />

            {/* <Route
              path="/"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />

                  <ProductUser products={products} isLogin={isLogin} setIsLogin={setIsLogin} />

                  <Footer />
                </>
              }
            /> */}
            <Route
              path="/product/ordermanagement"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <OrderManagement />
                </>
              }
            />
            <Route
              path="/verifyorder"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <VerifyOrder />{" "}
                </>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />

                  <ProductUser isLogin={isLogin} setIsLogin={setIsLogin} />

                  <Footer />
                </>
              }
            />
            <Route
              path="/productuser"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <ProductUser isLogin={isLogin} setIsLogin={setIsLogin} />
                  <Footer />
                </>
              }
            />
            <Route path="/accessdenied" element={<AccessDenied />} />
            <Route
              path="/view-profile"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <ViewProfile />
                </>
              }
            />
            <Route
              path="/order-tracking"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <OrderTracking />
                </>
              }
            />
            <Route
              path="/verifyorder"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <VerifyOrder />
                  <Footer />
                </>
              }
            />
            <Route
              path="/answerquestion"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <AnswerQuestion />
                  <Footer />
                </>
              }
            />
            <Route
              path="/terms"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <Term />
                  <Footer />
                </>
              }
            />
            <Route
              path="/rules"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <StoreRules />
                  <Footer />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <Cart />
                </>
              }
            />
            <Route
              path="/product/:id/detail"
              element={
                <>
                  <ProductDetail isLogin={isLogin} setIsLogin={setIsLogin} />
                </>
              }
            />
            <Route
              path="/productadmin"
              element={
                <>
                  <ProductAdmin isLogin={isLogin} setIsLogin={setIsLogin} />
                </>
              }
            />
            <Route
              path="/change-password"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <ChangePassword />
                </>
              }
            />
            <Route
              path="/User/productUser"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <UserManagement />
                </>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
