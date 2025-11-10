import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  Form,
  Container,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import Footer from "./Footer";

function Cart() {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [email, setEmail] = useState("");

  const [cart, setCart] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    return storedCart ? storedCart.sort((a, b) => a.id - b.id) : [];
  });

  // Lấy thông tin từ account đã đăng nhập
  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts"));
    if (storedAccounts && storedAccounts.length > 0) {
      const account = storedAccounts[0];
      setFullName(account.name || "");
      setEmail(account.email || "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const calculateTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    const vat = (total * 8) / 100;
    const priceTotal = total + vat;
    return priceTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split("T")[0];

    let errors = [];
    if (fullName.trim() === "") {
      errors.push("Vui lòng điền họ tên");
    }
    if (address.trim() === "") {
      errors.push("Vui lòng điền địa chỉ của bạn");
    }
    if (phone.trim() === "") {
      errors.push("Vui lòng điền số điện thoại");
    }
    if (requestDate === "") {
      errors.push("Vui lòng điền Ngày Yêu Cầu Nhận Hàng");
    }
    if (requestDate < formattedCurrentDate) {
      errors.push("Ngày yêu cầu nhận hàng phải là các ngày trong tương lai");
    }
    if (email.trim() === "") {
      errors.push("Hãy điền Email của bạn");
    }
    if (!phone.match(/^\d{10}$/)) {
      errors.push("Số điện thoại không đúng định dạng (10 chữ số)");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }

    const confirmInfo = window.confirm(
      `Bạn có chắc chắn rằng các thông tin của mình là chính xác?`
    );
    if (!confirmInfo) {
      return false;
    }

    const storedAccounts = JSON.parse(localStorage.getItem("accounts"));
    if (!storedAccounts || storedAccounts.length === 0) {
      alert("Bạn chưa đăng nhập");
      navigate("/auth/login");
      return;
    }

    const accountId = storedAccounts[0].id;

    // Tạo ID đơn hàng ngẫu nhiên
    const orderId = Math.random().toString(36).substring(2, 6);

    const loggedOrder = {
      id: orderId,
      accountId: accountId,
      fullName: fullName,
      address: address,
      phone: phone,
      email: email,
      product: cart.map((item) => ({
        pid: item.id,
        pName: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      vat: "8%",
      total: calculateTotal().toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
      shipping: 0,
      status: "Ordered",
      orderAt: formattedCurrentDate,
      reqDate: requestDate,
    };

    fetch("http://localhost:9999/orderDetailsLogged", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loggedOrder),
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("cart");
          localStorage.removeItem("cartCount");
          toast.success(`Đơn hàng của bạn đã được đặt thành công!`, {
            autoClose: 2000,
            closeButton: false,
            hideProgressBar: true,
            position: "top-center",
          });
          navigate("/order-tracking");
        } else {
          throw new Error("Gửi đơn đặt hàng không thành công");
        }
      })
      .catch((error) => {
        console.error("Có lỗi khi gửi đơn:", error);
        alert("Có lỗi khi đặt hàng. Hãy thử lại sau");
      });
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      localStorage.removeItem("cart");
      localStorage.removeItem("cartCount");
      window.location.reload();
      toast.success(`Bạn đã xoá toàn bộ sản phẩm trong giỏ hàng`, {
        autoClose: 2000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
      });
    }
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    const remainingItemsCount = updatedCart.length;
    localStorage.setItem("cartCount", remainingItemsCount.toString());
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng", {
      autoClose: 1500,
      closeButton: false,
      hideProgressBar: true,
      position: "top-right",
    });
  };

  const handleQuantityChange = (id, change) => {
    const itemToUpdate = cart.find((item) => item.id === id);
    if (!itemToUpdate) {
      return;
    }
    const updatedQuantity = itemToUpdate.quantity + change;
    if (updatedQuantity === 0) {
      const confirmInfo = window.confirm(
        `Bạn muốn loại bỏ hẳn sản phẩm "${itemToUpdate.name}" khỏi Giỏ Hàng ?`
      );
      if (!confirmInfo) {
        return;
      }
    }
    if (updatedQuantity > 10) {
      toast.warning("Bạn chỉ có thể mua tối đa 10 sản phẩm mỗi loại!", {
        autoClose: 2000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
      });
      return;
    }

    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    const remainingItemsCount = updatedCart.length;
    localStorage.setItem("cartCount", remainingItemsCount.toString());
  };

  return (
    <Container fluid>
      <Row
        style={{
          textAlign: "center",
          fontWeight: 700,
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{
          background: "linear-gradient(135deg, #2563eb 0%, #f59e0b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: "2.5rem"
        }}>Giỏ Hàng Của Bạn</h1>
      </Row>
      {cart.length === 0 ? (
        <Alert
          variant="danger"
          style={{ margin: "auto", height: "auto", fontSize: "1.5rem" }}
        >
          Giỏ Hàng của bạn đang trống!{" "}
          <Link to={"/"}>Quay lại Shop ngay 🛒💻📱</Link>
        </Alert>
      ) : (
        <>
          <Row className="mt-3 mb-3">
            <Row>
              <Col
                xs={6}
                style={{
                  textAlign: "start",
                  marginBottom: "1rem",
                  marginTop: "5px",
                }}
              >
                <Button
                  style={{
                    background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                  as={Link}
                  to="/"
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  &larr;Trở về <Home />
                </Button>
              </Col>
              <Col xs={6} style={{ textAlign: "end", marginBottom: "1rem" }}>
                <Button
                  style={{
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                  onClick={handleClearAll}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  Xóa Giỏ Hàng <DeleteIcon />
                </Button>
              </Col>
            </Row>
            <Table hover striped bordered style={{
              background: "white",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá Thành</th>
                  <th>Số Lượng</th>
                  <th>Tổng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>
                      <img
                        src={`${c.image}`}
                        style={{ width: "100px" }}
                        alt={c.name}
                      />
                    </td>
                    <td>{c.name}</td>
                    <td>
                      {c.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      <Button
                        style={{
                          background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          minWidth: "40px"
                        }}
                        size="sm"
                        onClick={() => handleQuantityChange(c.id, -1)}
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        min="1"
                        max={10}
                        value={c.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          if (newQuantity > 10) {
                            toast.warning(
                              `Bạn chỉ có thể mua tối đa 10 sản phẩm trong ngày!`,
                              {
                                autoClose: 2000,
                                closeButton: false,
                                hideProgressBar: true,
                                position: "top-center",
                              }
                            );
                            return;
                          }
                          if (newQuantity < 1) {
                            handleRemove(c.id);
                            return;
                          }
                          handleQuantityChange(c.id, newQuantity - c.quantity);
                        }}
                        style={{
                          width: "50px",
                          textAlign: "center",
                          margin: "0 5px",
                        }}
                      />
                      <Button
                        style={{
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          minWidth: "40px"
                        }}
                        size="sm"
                        onClick={() => {
                          if (c.quantity >= 10) {
                            toast.warning(
                              `Bạn chỉ có thể mua tối đa 10 sản phẩm trong ngày!`,
                              {
                                autoClose: 2000,
                                closeButton: false,
                                hideProgressBar: true,
                                position: "top-center",
                              }
                            );
                            return;
                          }
                          handleQuantityChange(c.id, 1);
                        }}
                      >
                        +
                      </Button>
                    </td>
                    <td>
                      {(c.price * c.quantity).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      <Button
                        style={{
                          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          minWidth: "40px"
                        }}
                        onClick={() => handleRemove(c.id)}
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row style={{ textAlign: "end" }}>
              <h3>
                VAT:
                <span style={{ color: "red" }}> 8%</span>
              </h3>
              <h3>
                Thành Tiền:
                <span style={{ color: "red" }}>
                  {" "}
                  {calculateTotal().toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </h3>
            </Row>
          </Row>

          {/* Form điền thông tin cho người mua đã đăng nhập */}
          <Row style={{ marginTop: "20px" }}>
            <h3>Thông tin vận chuyển cho đơn hàng</h3>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Row className="mt-2">
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Họ và Tên(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Email(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>
              </Row>
              <Row className="mt-2">
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Địa chỉ của bạn(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      name="address"
                      as="textarea"
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Số điện thoại(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      name="phone"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>
              </Row>
              <Row className="mt-2">
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Ngày yêu cầu nhận hàng(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      name="requestDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>
              </Row>
              <Row className="mt-3">
                <Col>
                  <div>
                    <span>
                      <Button
                        type="submit"
                        style={{
                          borderColor: "orange",
                          backgroundColor: hover ? "#FFD700" : "orange",
                          color: hover ? "black" : "white",
                          marginBottom: "5px",
                          marginLeft: "-4px",
                          transition:
                            "background-color 0.3s ease, color 0.3s ease",
                        }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                      >
                        Thanh Toán Ngay
                      </Button>
                    </span>
                  </div>
                </Col>
              </Row>
            </Form>
          </Row>
        </>
      )}
      <Footer />
    </Container>
  );
}

export default Cart;

