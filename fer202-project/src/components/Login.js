import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import "./style.css"; 
export default function Login({ isLogin, setIsLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Adjust the endpoint if your backend differs
      const res = await fetch(`http://localhost:9999/accounts`);
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      const accounts = await res.json();
      const findAccounts = accounts.find((account) => account.email === email && account.password === password);

      if (findAccounts) {
        if (findAccounts.isActive === false) {
          navigate("/accessdenied");
        } else {
          const { password: _pwd, ...accountData } = findAccounts; // do not store password in localStorage
          localStorage.setItem("accounts", JSON.stringify([accountData]));
          setIsLogin && setIsLogin(true);
          navigate(findAccounts.role === "admin" ? "/productadmin" : "/");
        }
      } else {
        alert("Sai Email hoặc Mật Khẩu. Vui lòng nhập lại");
        setIsLogin && setIsLogin(false);
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi đăng nhập. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="auth-login-wrapper">
      {/* <Row className="bg-dark pt-3 pb-3">
        <Col>
          <a href="/productuser" className="text-decoration-none">
            <h2 className="m-0 display-5 font-weight-semi-bold">
              <span className="text-primary font-weight-bold border px-3 mr-1">H</span>
              -Tech Store
            </h2>
          </a>
        </Col>
      </Row>
      <div>
        <Link style={{ margin: "25px" }} to={"/productuser"} className="btn btn-dark">
          &larr; Trang chủ
        </Link>
      </div> */}
      <Row>
        <Col xs lg="4"></Col>
        <Col>
          <div className="login-card">
            <h2 className="text-center">Đăng Nhập</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email (*)
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Nhập Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mật Khẩu (*)
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Form.Group controlId="formBasicCheckbox" className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <Form.Check type="checkbox" label="Lưu mật khẩu" />
                </div>
                <div>
                  <Link style={{ textDecoration: "none" }} to="#">
                    Quên mật khẩu?
                  </Link>
                </div>
              </Form.Group>

              <div className="text-center">
                <button type="submit" className="btn btn-primary btn-lg">
                  Đăng Nhập
                </button>
              </div>
              <div className="mt-3 text-center">
                <p>
                  Bạn không có tài khoản?{' '}
                  <Link style={{ color: "#c62828", textDecoration: "none" }} to="/auth/register">
                    Đăng Ký Ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </Col>
        <Col xs lg="4"></Col>
      </Row>
    </div>
  );
}
