import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Login.css";

export default function Login({ isLogin, setIsLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:9999/accounts");
      if (!res.ok) throw new Error("Fetch failed");
      const accounts = await res.json();

      const find = accounts.find(
        (acc) => acc.email === email && acc.password === password
      );

      if (find) {
        if (!find.isActive) {
          navigate("/accessdenied");
        } else {
          const { password: _, ...accountData } = find;
          localStorage.setItem("accounts", JSON.stringify([accountData]));
          setIsLogin && setIsLogin(true);
          toast.success("Đăng nhập thành công!");
          navigate(find.role === "admin" ? "/productadmin" : "/");
        }
      } else {
        toast.error("Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống!");
    }
  };

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center">
        <div className="login-card">
          <div className="text-center mb-4">
            <span className="login-icon">🔐</span>
            <h3 className="fw-bold">Đăng Nhập</h3>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <div className="password-input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Check type="checkbox" label="Lưu mật khẩu" />
              <Link to="#" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" className="w-100 login-btn">
              Đăng Nhập
            </Button>

            <div className="text-center mt-3">
              <p>
                Chưa có tài khoản?{" "}
                <Link to="/auth/register" className="register-link">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}
