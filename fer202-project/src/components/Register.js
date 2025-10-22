import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import "./style.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setAccounts(storedAccounts);
  }, []);

  useEffect(() => {
    // optional: fetch accounts from backend if available
    fetch("http://localhost:9999/accounts")
      .then((res) => res.json())
      .then((json) => setAccounts(json))
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = [];
    if (name.trim() === "") errors.push("Hãy nhập tên của bạn.");
    if (!email.includes("@")) errors.push('Địa chỉ email không hợp lệ');
    else if (accounts?.find((account) => account.email === email)) errors.push("Địa chỉ email đã tồn tại.");
    if (dob.trim() === "") errors.push("Hãy nhập ngày sinh.");
    if (!gender) errors.push("Hãy chọn giới tính.");
    if (password.trim() === "") errors.push("Mật khẩu không được để trống");
    else if (password.length < 6) errors.push("Mật khẩu phải chứa ít nhất 6 ký tự!");
    if (password !== confirmPassword) errors.push("Xác nhận lại mật khẩu không trùng khớp!");

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const maxId = accounts.reduce((max, account) => Math.max(max, parseInt(account.id || 0, 10)), 0);
    const newId = (maxId + 1).toString();
    const isAdmin = /^admin\d*@gmail\.com$/.test(email);

    const newAccount = {
      id: newId,
      name: name,
      email: email,
      password: password,
      dob: dob,
      gender: gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Khác",
      role: isAdmin ? "admin" : "user",
      isActive: true,
    };

    // Update localStorage immediately so the new account is available locally
    localStorage.setItem("accounts", JSON.stringify([newAccount, ...accounts]));

    // Optionally POST to backend (json-server) if available
    fetch("http://localhost:9999/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAccount),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error creating account");
        return response.json();
      })
      .then(() => {
        alert("Tài khoản của bạn đã được tạo thành công!");
        navigate("/auth/login");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setDob("");
        setGender("");
      })
      .catch(() => {
        // If backend fails, UI already saved the account to localStorage
        alert("Tạo tài khoản (cục bộ) thành công. Lưu ý: không thể lưu tới server.");
        navigate("/auth/login");
      });
  };

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-md-6 register-image">
          <img src="https://static.vecteezy.com/system/resources/previews/016/181/833/original/register-now-banner-design-vector.jpg" alt="Register" style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="col-md-6 register-form">
          <h2 className="text-center mt-2">Đăng Ký Tài Khoản</h2>
          <Link style={{ marginBottom: "20px" }} to={"/productuser"} className="btn btn-dark">&larr; Trở về trang chủ</Link>
          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Tên Đăng Nhập (*)</label>
              <input type="text" className="form-control" id="name" value={name} placeholder="Tên hiển thị" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email (*)</label>
              <input type="email" className="form-control" id="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mật Khẩu (*)</label>
              <input type="password" className="form-control" id="password" value={password} placeholder="Nhập mật khẩu" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Xác Nhận Lại Mật Khẩu (*)</label>
              <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} placeholder="Xác nhận mật khẩu" onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">Ngày sinh</label>
              <input type="date" className="form-control" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Giới Tính (*)</label>
              <div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="male" value="male" checked={gender === "male"} onChange={() => setGender("male")} />
                  <label className="form-check-label" htmlFor="male">Nam</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="female" value="female" checked={gender === "female"} onChange={() => setGender("female")} />
                  <label className="form-check-label" htmlFor="female">Nữ</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="other" value="other" checked={gender === "other"} onChange={() => setGender("other")} />
                  <label className="form-check-label" htmlFor="other">Khác</label>
                </div>
              </div>
            </div>
            <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
              <input type="checkbox" id="agree-privacy-policy" onChange={(e) => setIsAgreed(e.target.checked)} />
              <label htmlFor="agree-privacy-policy" style={{ marginLeft: "10px", fontSize: "16px", cursor: "pointer" }}>
                Tôi đồng ý với các điều khoản
              </label>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-dark btn-lg" disabled={!isAgreed}>Đăng Ký</button>
            </div>
            <div className="mt-3 text-center">
              <p>Bạn đã có tài khoản?{' '}<Link to={"/auth/login"} style={{ textDecoration: "none" }}>Đăng Nhập Ngay</Link></p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
