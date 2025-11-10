import { useState, useEffect } from "react";
import { Table, Button, Spinner, Modal } from "react-bootstrap";
import "./css/StyleAdmin.css";

const OrderManagement = () => {
  const [loggedOrders, setLoggedOrders] = useState([]);
  const [noLoginOrders, setNoLoginOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompletedOrders, setShowCompletedOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [loggedResponse, noLoginResponse] = await Promise.all([
          fetch("http://localhost:9999/orderDetailsLogged"),
          fetch("http://localhost:9999/orderDetailsNoLogin"),
        ]);
        const loggedOrders = await loggedResponse.json();
        const noLoginOrders = await noLoginResponse.json();
        setLoggedOrders(loggedOrders);
        setNoLoginOrders(noLoginOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Dừng loading sau khi tải xong
      }
    };
    fetchOrders();
  }, []);

  const handleApproveOrder = async (orderId, isNoLogin) => {
    const endpoint = isNoLogin
      ? `http://localhost:9999/orderDetailsNoLogin`
      : `http://localhost:9999/orderDetailsLogged`;
    const confirmApprove = window.confirm(
      `Bạn có chắc chắn muốn DUYỆT đơn hàng "${orderId}?"`
    );
    if (!confirmApprove) return;

    try {
      const response = await fetch(`${endpoint}/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });

      if (response.ok) {
        if (isNoLogin) {
          setNoLoginOrders((prev) =>
            prev.map((order) =>
              order.id === orderId ? { ...order, status: "Approved" } : order
            )
          );
        } else {
          setLoggedOrders((prev) =>
            prev.map((order) =>
              order.id === orderId ? { ...order, status: "Approved" } : order
            )
          );
        }
      } else {
        throw new Error("Cập nhật trạng thái không thành công");
      }
    } catch (error) {
      console.error("Error approving order:", error);
      alert("Có lỗi khi duyệt đơn hàng. Hãy thử lại sau.");
    }
  };

  const handleRejectOrder = (orderId, isNoLogin) => {
    const endpoint = isNoLogin
      ? `http://localhost:9999/orderDetailsNoLogin`
      : `http://localhost:9999/orderDetailsLogged`;
    const confirmReject = window.confirm(
      `Bạn có chắc chắn muốn TỪ CHỐI đơn hàng "${orderId}?"`
    );
    if (!confirmReject) return;
    fetch(`${endpoint}/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected" }),
    })
      .then((response) => {
        if (response.ok) {
          if (isNoLogin) {
            setNoLoginOrders((prev) =>
              prev.map((order) =>
                order.id === orderId ? { ...order, status: "Rejected" } : order
              )
            );
          } else {
            setLoggedOrders((prev) =>
              prev.map((order) =>
                order.id === orderId ? { ...order, status: "Rejected" } : order
              )
            );
          }
        } else {
          throw new Error("Cập nhật trạng thái không thành công");
        }
      })
      .catch((error) => {
        console.error("Error rejecting order:", error);
        alert("Có lỗi khi từ chối đơn hàng. Hãy thử lại sau.");
      });
  };
  //Lọc các đơn đã có status là archived
  const archivedOrders = [
    ...loggedOrders.filter((order) => order.status === "Archived"),
    ...noLoginOrders.filter((order) => order.status === "Archived"),
  ];
  //Hàm xử lý các đơn hàng đã lưu trữ, tức là đã vận chuyển thành công
  const handleArchiveOrder = (orderId, isNoLogin = false) => {
    const confirmArchive = window.confirm(
      `Bạn có chắc chắn muốn lưu trữ đơn hàng "${orderId}"?`
    );
    if (!confirmArchive) return;

    const url = isNoLogin
      ? `http://localhost:9999/orderDetailsNoLogin/${orderId}`
      : `http://localhost:9999/orderDetailsLogged/${orderId}`;
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Archived" }),
    })
      .then((response) => {
        if (response.ok) {
          // Cập nhật trạng thái và loại bỏ đơn hàng đã lưu trữ khỏi danh sách
          if (isNoLogin) {
            setNoLoginOrders((prev) =>
              prev.filter((order) => order.id !== orderId)
            );
          } else {
            setLoggedOrders((prev) =>
              prev.filter((order) => order.id !== orderId)
            );
          }
        } else {
          throw new Error("Không thể lưu trữ đơn hàng");
        }
      })
      .catch((error) => {
        console.error("Error archiving order:", error);
        alert("Có lỗi khi lưu trữ đơn hàng. Hãy thử lại sau.");
      });
  };

  const handleShowCompletedOrders = () => setShowCompletedOrders(true);
  const handleCloseCompletedOrders = () => setShowCompletedOrders(false);

  const renderTable = (orders, isNoLogin = false) => (
    <div className="admin-table-container">
      <Table striped bordered hover responsive className="admin-table">
        <thead>
          <tr style={{ textAlign: "center" }}>
            <th>Mã đơn</th>
            <th>Họ tên</th>
            <th>Địa chỉ nhận</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Sản phẩm đã đặt</th>
            <th>Tổng tiền</th>
            <th>Ngày Nhận</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders
            .filter((order) => order.status !== "Archived") // Lọc bỏ các đơn hàng đã lưu trữ
            .map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600 }}>{order.id}</td>
                <td>
                  {isNoLogin
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : order.fullName}
                </td>
                <td>{isNoLogin ? order.customer.address : order.address}</td>
                <td>{isNoLogin ? order.customer.phone : order.phone}</td>
                <td>{isNoLogin ? order.customer.email : order.email}</td>
                <td>
                  {order.product
                    .map((item) => (
                      <>
                        {item.pName} (
                        <span style={{ color: "#ef4444", fontWeight: 600 }}>
                          {item.pid}
                        </span>
                        )
                      </>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr])}
                </td>
                <td style={{ fontWeight: 700, color: "#ef4444" }}>
                  {typeof order.total === "string"
                    ? order.total
                    : order.total.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                </td>
                <td>
                  {new Date(
                    order.reqDate || order.requestDate
                  ).toLocaleDateString("vi-VN")}
                </td>
                <td>
                  <span
                    className={`admin-status-badge ${
                      order.status === "Approved"
                        ? "admin-status-available"
                        : order.status === "Ordered"
                        ? "admin-status-ordered"
                        : order.status === "Archived"
                        ? "admin-status-archived"
                        : "admin-status-out-of-stock"
                    }`}
                  >
                    {order.status === "Ordered"
                      ? "Đang chờ"
                      : order.status === "Approved"
                      ? "Đã duyệt"
                      : order.status === "Rejected"
                      ? "Đã từ chối"
                      : order.status === "Archived"
                      ? "Đã lưu trữ"
                      : order.status}
                  </span>
                </td>
                <td>
                  {order.status === "Ordered" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        className="admin-btn-edit"
                        onClick={() => handleApproveOrder(order.id, isNoLogin)}
                        style={{
                          background:
                            "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        }}
                      >
                        Đồng ý
                      </Button>
                      <Button
                        className="admin-btn-delete"
                        onClick={() => handleRejectOrder(order.id, isNoLogin)}
                      >
                        Từ chối
                      </Button>
                    </div>
                  )}
                  {order.status === "Approved" && (
                    <Button
                      className="admin-btn-edit"
                      onClick={() => handleArchiveOrder(order.id, isNoLogin)}
                      style={{
                        background:
                          "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                      }}
                    >
                      Lưu trữ
                    </Button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          marginBottom: "1.5rem",
          marginTop: "0.5rem",
          padding: "0.75rem 1rem",
          background: "rgba(37, 99, 235, 0.1)",
          borderRadius: "0.5rem",
        }}
      >
        <a
          href="/productadmin"
          className="admin-back-link"
          style={{ textDecoration: "none" }}
        >
          Administrator
        </a>{" "}
        <span style={{ color: "#64748b" }}>&gt;</span>{" "}
        <strong style={{ color: "#1e293b" }}>Quản lý đơn hàng</strong>
      </div>
      <h1
        style={{
          textAlign: "center",
          fontWeight: 700,
          margin: "1.5rem 0",
          background: "linear-gradient(135deg, #2563eb 0%, #f59e0b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: "2.5rem",
        }}
      >
        Danh sách các đơn hàng
      </h1>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Button
          className="admin-btn-add"
          onClick={handleShowCompletedOrders}
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
          }}
        >
          Các đơn hàng đã hoàn thành
        </Button>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <Spinner
            animation="border"
            variant="primary"
            style={{ width: "3rem", height: "3rem" }}
          />
        </div>
      ) : (
        <>
          <h3
            style={{
              color: "#2563eb",
              textAlign: "center",
              marginTop: "2rem",
              marginBottom: "1rem",
              fontWeight: 700,
              fontSize: "1.5rem",
            }}
          >
            Người dùng đã đăng nhập
          </h3>
          {renderTable(loggedOrders)}

          <h3
            style={{
              color: "#ef4444",
              marginTop: "2rem",
              textAlign: "center",
              marginBottom: "1rem",
              fontWeight: 700,
              fontSize: "1.5rem",
            }}
          >
            Người dùng không đăng nhập
          </h3>
          {renderTable(noLoginOrders, true)}
        </>
      )}

      {/* Modal cho các đơn hàng đã hoàn thành */}
      <Modal
        show={showCompletedOrders}
        onHide={handleCloseCompletedOrders}
        size="lg"
        centered
        className="admin-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Các đơn hàng đã hoàn thành và được lưu trữ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {archivedOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <p style={{ color: "#64748b", fontSize: "1.125rem" }}>
                Chưa có đơn hàng nào được lưu trữ.
              </p>
            </div>
          ) : (
            <div className="admin-table-container">
              <Table striped bordered hover responsive className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Họ tên</th>
                    <th>Địa chỉ nhận</th>
                    <th>Điện thoại</th>
                    <th>Email</th>
                    <th>Sản phẩm đã đặt</th>
                    <th>Tổng tiền</th>
                    <th>Ngày nhận</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 600 }}>{order.id}</td>
                      <td>
                        {order.customer
                          ? `${order.customer.firstName} ${order.customer.lastName}`
                          : order.fullName}
                      </td>
                      <td>
                        {order.customer
                          ? order.customer.address
                          : order.address}
                      </td>
                      <td>
                        {order.customer ? order.customer.phone : order.phone}
                      </td>
                      <td>
                        {order.customer ? order.customer.email : order.email}
                      </td>
                      <td>
                        {order.product
                          .map((item) => (
                            <>
                              {item.pName} (
                              <span
                                style={{ color: "#ef4444", fontWeight: 600 }}
                              >
                                {item.pid}
                              </span>
                              )
                            </>
                          ))
                          .reduce((prev, curr) => [prev, ", ", curr])}
                      </td>
                      <td style={{ fontWeight: 700, color: "#ef4444" }}>
                        {typeof order.total === "string"
                          ? order.total
                          : order.total.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                      </td>
                      <td>
                        {new Date(
                          order.reqDate || order.requestDate
                        ).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="admin-modal-btn-cancel"
            onClick={handleCloseCompletedOrders}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
