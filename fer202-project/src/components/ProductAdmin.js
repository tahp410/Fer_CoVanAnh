import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
  Nav,
  Tab,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import OrderManagement from "./OrderManagement";
import "./css/StyleAdmin.css";

function ProductAdmin({ isLogin, setIsLogin }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    catID: "",
    descreption: "",
    status: "Còn hàng",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:9999/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const fetchCategories = () => {
    fetch("http://localhost:9999/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      quantity: "",
      catID: "",
      descreption: "",
      status: "Còn hàng",
      image: "",
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      catID: product.catID,
      descreption: product.descreption,
      status: product.status,
      image: product.image,
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      fetch(`http://localhost:9999/products/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            toast.success("Xóa sản phẩm thành công!");
            fetchProducts();
          } else {
            throw new Error("Không thể xóa sản phẩm");
          }
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          toast.error("Có lỗi xảy ra khi xóa sản phẩm");
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseInt(formData.price),
      quantity: parseInt(formData.quantity),
      date: new Date().toISOString().split("T")[0],
    };

    if (editingProduct) {
      // Update existing product
      fetch(`http://localhost:9999/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })
        .then((res) => {
          if (res.ok) {
            toast.success("Cập nhật sản phẩm thành công!");
            setShowModal(false);
            fetchProducts();
          } else {
            throw new Error("Không thể cập nhật sản phẩm");
          }
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
        });
    } else {
      // Create new product
      const maxId = products.reduce((max, p) => {
        const numId = parseInt(p.id.replace("P", ""));
        return numId > max ? numId : max;
      }, 0);
      const newId = `P${String(maxId + 1).padStart(4, "0")}`;

      fetch("http://localhost:9999/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productData, id: newId }),
      })
        .then((res) => {
          if (res.ok) {
            toast.success("Thêm sản phẩm thành công!");
            setShowModal(false);
            fetchProducts();
          } else {
            throw new Error("Không thể thêm sản phẩm");
          }
        })
        .catch((error) => {
          console.error("Error adding product:", error);
          toast.error("Có lỗi xảy ra khi thêm sản phẩm");
        });
    }
  };

  return (
    <>
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Quản Lý Cửa Hàng - Administrator</h1>
          <Link to="/" className="admin-back-link">
            &larr; Về Trang Chủ
          </Link>
        </div>

        <Tab.Container defaultActiveKey="products">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column admin-nav">
                <Nav.Item>
                  <Nav.Link eventKey="products">Quản Lý Sản Phẩm</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="orders">Quản Lý Đơn Hàng</Nav.Link>
                </Nav.Item>
              </Nav>
              <Button
                variant="info"
                as={Link}
                to="/User/productUser"
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                Quản Lý Tài Khoản
              </Button>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="products">
                  <div className="admin-table-container">
                    <Button
                      className="admin-btn-add"
                      onClick={handleAddProduct}
                    >
                      + Thêm Sản Phẩm Mới
                    </Button>
                    <Table
                      striped
                      bordered
                      hover
                      responsive
                      className="admin-table"
                    >
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Ảnh</th>
                          <th>Tên</th>
                          <th>Giá</th>
                          <th>Số lượng</th>
                          <th>Trạng thái</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td>{product.name}</td>
                            <td>
                              {product.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </td>
                            <td>{product.quantity}</td>
                            <td>
                              <span
                                className={`admin-status-badge ${
                                  product.status === "Còn hàng"
                                    ? "admin-status-available"
                                    : "admin-status-out-of-stock"
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td>
                              <Button
                                className="admin-btn-edit"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                Sửa
                              </Button>
                              <Button
                                className="admin-btn-delete"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Xóa
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="orders">
                  <OrderManagement />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

        {/* Modal Add/Edit Product */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          className="admin-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="admin-form-group">
                <Form.Label className="admin-form-label">
                  Tên sản phẩm (*)
                </Form.Label>
                <Form.Control
                  type="text"
                  className="admin-form-control"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Nhập tên sản phẩm"
                />
              </Form.Group>
              <Form.Group className="admin-form-group">
                <Form.Label className="admin-form-label">Giá (*)</Form.Label>
                <Form.Control
                  type="number"
                  className="admin-form-control"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  placeholder="Nhập giá sản phẩm"
                  min="0"
                />
              </Form.Group>
              <Form.Group className="admin-form-group">
                <Form.Label className="admin-form-label">
                  Số lượng (*)
                </Form.Label>
                <Form.Control
                  type="number"
                  className="admin-form-control"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                  placeholder="Nhập số lượng"
                  min="0"
                />
              </Form.Group>
              <Form.Group className="admin-form-group">
                <Form.Label className="admin-form-label">
                  Danh mục (*)
                </Form.Label>
                <Form.Select
                  className="admin-form-select"
                  value={formData.catID}
                  onChange={(e) =>
                    setFormData({ ...formData, catID: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="admin-form-group">
                <Form.Label className="admin-form-label">Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  className="admin-form-textarea"
                  rows={3}
                  value={formData.descreption}
                  onChange={(e) =>
                    setFormData({ ...formData, descreption: e.target.value })
                  }
                  placeholder="Nhập mô tả sản phẩm"
                />
              </Form.Group>
              <Form.Group className="admin-form-group">
                <Form.Label className="admin-form-label">Trạng thái</Form.Label>
                <Form.Select
                  className="admin-form-select"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Còn hàng">Còn hàng</option>
                  <option value="Hết hàng">Hết hàng</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="admin-form-group">
                <Form.Label className="admin-form-label">
                  Đường dẫn ảnh
                </Form.Label>
                <Form.Control
                  type="text"
                  className="admin-form-control"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="/assets/images/product1.png"
                />
              </Form.Group>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1.5rem",
                }}
              >
                <Button className="admin-modal-btn-submit" type="submit">
                  {editingProduct ? "Cập nhật" : "Thêm mới"}
                </Button>
                <Button
                  className="admin-modal-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      <Footer />
    </>
  );
}

export default ProductAdmin;
