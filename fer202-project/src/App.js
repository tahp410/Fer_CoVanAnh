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
            />{" "}
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
