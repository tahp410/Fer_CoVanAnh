import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Register from "./components/Register";
import "./components/style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import ProductUser from "./components/ProductUser";
import StoreRules from "./hooks/StoreRules";
import { Term } from "../src/hooks/Term";
import AccessDenied from "./components/AccessDenied";
import ViewProfile from "./components/ViewProfile";
import OrderTracking from "./components/OrderTracking";
import OrderManagement from "./components/OrderManagement";
import VerifyOrder from "./components/verifyOrder";
export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [products, setProducts] = useState([]);
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

                  <ProductUser
                    products={products}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                  />

                  <Footer />
                </>
              }
            />
            <Route path="/accessdenied" element={<AccessDenied />} />

            <Route
              path="/terms"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <Term />
                </>
              }
            />
            <Route
              path="/rules"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <StoreRules />
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
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
