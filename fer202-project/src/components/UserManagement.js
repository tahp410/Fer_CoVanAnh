import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Spinner,
  Modal,
  Card,
  Badge,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [error, setError] = useState(null);

  // Check role từ "accounts" trong localStorage
  useEffect(() => {
    const loggedInAccount = JSON.parse(localStorage.getItem("accounts"));
    if (loggedInAccount && loggedInAccount.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  // Fetch danh sách mảng accounts
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:9999/accounts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((result) => setUsers(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleActive = (userId, currentStatus) => {
    setLoading(true);
    fetch(`http://localhost:9999/accounts/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: !currentStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then(() => {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, isActive: !currentStatus } : user
          )
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleRoleChange = (userId, newRole) => {
    setLoading(true);
    fetch(`http://localhost:9999/accounts/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update role");
        return res.json();
      })
      .then(() => {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleRemoveAccount = async (accountId) => {
    try {
      const response = await fetch(
        `http://localhost:9999/accounts/${accountId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Không thể xóa tài khoản.");
      }
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== accountId)
      );
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      alert("Có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại sau.");
    }
  };

  const accounts = JSON.parse(localStorage.getItem("accounts"));
  const currentAccount = accounts?.find(
    (account) => account.role === "admin" && account.isActive === true
  );
  if (!currentAccount) {
    return <Navigate to="/accessdenied" />;
  }

  const handleShowModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleModalAction = () => {
    modalContent.action();
    setShowModal(false);
  };

  return (
    <Container fluid style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <Row>
        {/* Sidebar */}
        <Col
          xs={12}
          sm={3}
          md={2}
          style={{
            backgroundColor: "#fff",
            borderRight: "1px solid #dee2e6",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
          }}
        >
          <h4
            className="text-center mb-4"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "10px",
              padding: "10px 0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            Trang Quản Trị
          </h4>

          <div className="d-grid gap-3">
            <Button as={Link} to={"/productuser"} variant="outline-success">
              Giao Diện Khách
            </Button>

            <Button as={Link} to="/productadmin" variant="outline-dark">
              Quản Lý Sản Phẩm và Đơn Hàng
            </Button>
          </div>
        </Col>

        {/* Main content */}
        <Col xs={12} sm={9} md={10} className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ fontWeight: "bold", color: "#333" }}>
              Danh Sách Tài Khoản
            </h2>
            <Badge bg="secondary" pill>
              Tổng cộng: {users.length}
            </Badge>
          </div>

          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          {error && <div className="text-danger mb-3">Lỗi: {error}</div>}

          <Card className="shadow-sm">
            <Card.Body>
              <Table hover responsive bordered>
                <thead style={{ backgroundColor: "#e9ecef" }}>
                  <tr>
                    <th>ID</th>
                    <th>Tên người dùng</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th colSpan={2} className="text-center">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={user.role}
                          onChange={(e) =>
                            handleShowModal({
                              title: "Xác nhận thay đổi vai trò",
                              message: `Bạn có chắc muốn thay đổi vai trò của ${user.name}?`,
                              action: () =>
                                handleRoleChange(user.id, e.target.value),
                            })
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Check
                          type="switch"
                          id={`switch-${user.id}`}
                          checked={user.isActive}
                          onChange={() =>
                            handleShowModal({
                              title: "Xác nhận thay đổi trạng thái",
                              message: `Bạn có chắc muốn thay đổi trạng thái của ${user.name}?`,
                              action: () =>
                                handleToggleActive(user.id, user.isActive),
                            })
                          }
                          label={
                            user.isActive ? (
                              <span className="text-success fw-semibold">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="text-muted fw-semibold">
                                Vô hiệu
                              </span>
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant={user.isActive ? "danger" : "success"}
                          onClick={() =>
                            handleShowModal({
                              title: user.isActive
                                ? "Vô hiệu hóa tài khoản"
                                : "Kích hoạt tài khoản",
                              message: `Bạn có chắc muốn ${
                                user.isActive ? "vô hiệu hóa" : "kích hoạt"
                              } tài khoản của ${user.name}?`,
                              action: () =>
                                handleToggleActive(user.id, user.isActive),
                            })
                          }
                        >
                          {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        </Button>
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() =>
                            handleShowModal({
                              title: "Xoá tài khoản vĩnh viễn",
                              message: `Bạn có chắc muốn xoá "${user.name}" khỏi hệ thống?`,
                              action: () => handleRemoveAccount(user.id),
                            })
                          }
                        >
                          Xoá
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal xác nhận */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleModalAction}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
