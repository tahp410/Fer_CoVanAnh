import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import './components/style.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem('accounts'));
    if (accounts) setIsLogin(true);
  }, []);

  return (
    <ThemeProvider>
      <div style={{ overflow: "hidden" }}> <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} />
          <Route
            path="/auth/register"
            element={
              <>
                {" "}
                <Header /> <Register />
              </>
            }
          />
          <Route path="/productuser" element={<div style={{ padding: 40 }}><h2>Demo Product User Home</h2><p>This is a placeholder home page. After login success the app navigates here.</p></div>} />
          <Route
            path="/"
            element={
              <>
                <Header isLogin={isLogin} setIsLogin={setIsLogin} />


                <Footer />
              </>
            }
          />
          <Route path="/" element={<div style={{ padding: 40 }}><h2>Root</h2><p>Visit <a href="/auth/login">/auth/login</a> or <a href="/auth/register">/auth/register</a></p></div>} />
        </Routes>
      </BrowserRouter>
      </div>
    </ThemeProvider>

  );
}
