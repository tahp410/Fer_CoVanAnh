import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import './components/style.css';

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem('accounts'));
    if (accounts) setIsLogin(true);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/productuser" element={<div style={{ padding: 40 }}><h2>Demo Product User Home</h2><p>This is a placeholder home page. After login success the app navigates here.</p></div>} />
        <Route path="/" element={<div style={{ padding: 40 }}><h2>Root</h2><p>Visit <a href="/auth/login">/auth/login</a> or <a href="/auth/register">/auth/register</a></p></div>} />
      </Routes>
    </BrowserRouter>
  );
}
