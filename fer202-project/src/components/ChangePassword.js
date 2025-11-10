import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import Footer from "./Footer";
import "./css/ChangePassword.css"; // ✅ File CSS riêng

function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }
    if (password.length < 6) {
      setPasswordStrength("weak");
      return;
    }
    if (password.length < 10) {
      setPasswordStrength("medium");
      return;
    }
    setPasswordStrength("strong");
  };

  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    checkPasswordStrength(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!currentPassword.trim()) errors.push("Vui lòng nhập mật khẩu hiện tại");
    if (!newPassword.trim()) errors.push("Vui lòng nhập mật khẩu mới");
    else if (newPassword.length < 6)
      errors.push("Mật khẩu mới phải có ít nhất 6 ký tự");
    if (newPassword !== confirmPassword)
      errors.push("Xác nhận mật khẩu không khớp");

    if (errors.length > 0) {
      toast.error(errors.join("\n"), { position: "top-center" });
      return;
    }

    try {
      const storedAccounts = JSON.parse(localStorage.getItem("accounts"));
      if (!storedAccounts || storedAccounts.length === 0) {
        toast.error("Bạn chưa đăng nhập");
        navigate("/auth/login");
        return;
      }

      const currentUser = storedAccounts[0];
      const response = await fetch(`http://localhost:9999/accounts/${currentUser.id}`);
      if (!response.ok) throw new Error("Không thể lấy thông tin tài khoản");

      const userData = await response.json();
      if (userData.password !== currentPassword) {
        toast.error("Mật khẩu hiện tại không đúng", { position: "top-center" });
        return;
      }

      const updateResponse = await fetch(`http://localhost:9999/accounts/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (updateResponse.ok) {
        const updatedUser = { ...currentUser, password: newPassword };
        localStorage.setItem("accounts", JSON.stringify([updatedUser]));

        toast.success("Đổi mật khẩu thành công!", {
          autoClose: 2000,
          hideProgressBar: true,
          position: "top-center",
        });

        setTimeout(() => navigate("/"), 2000);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordStrength("");
      } else {
        throw new Error("Không thể cập nhật mật khẩu");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      {/* Header được bọc ở App.js, tránh render trùng */}
      <div className="change-password-page">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={5} className="d-flex justify-content-center">
              <div className="password-card">
                <div className="password-header">
                  <span className="lock-icon">🔒</span>
                  <h2>Đổi Mật Khẩu</h2>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                    <div className="password-input-group">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <div className="password-input-group">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                      />
                    </div>
                    {passwordStrength && (
                      <div className={`password-strength ${passwordStrength}`}>
                        {passwordStrength === "weak" && "🔴 Mật khẩu yếu"}
                        {passwordStrength === "medium" && "🟠 Mật khẩu trung bình"}
                        {passwordStrength === "strong" && "🟢 Mật khẩu mạnh"}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <div className="password-input-group">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <div className="show-password-toggle">
                    <Form.Check
                      type="checkbox"
                      label="Hiện mật khẩu"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                  </div>

                  <div className="button-container mt-4">
                    <Button type="submit" className="change-password-button">
                      Đổi Mật Khẩu
                    </Button>
                    <Button as={Link} to="/" className="back-to-shop-button">
                      Về Trang Chủ
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default ChangePassword;
