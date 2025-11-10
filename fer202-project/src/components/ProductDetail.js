import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Button, Card, Container, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Header from "./Header";
import Footer from "./Footer";
import ChatWithShop from "../hooks/ChatWithShop";
import ReportProduct from "../hooks/ReportProduct";
import "./css/ProductDetail.css";

function ProductDetail({ isLogin, setIsLogin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [cartCount, setCartCount] = useState(() => parseInt(localStorage.getItem("cartCount")) || 0);

  useEffect(() => {
    fetch(`http://localhost:9999/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        fetch(`http://localhost:9999/products?catID=${data.catID}`)
          .then((res) => res.json())
          .then((products) => {
            const similar = products.filter((p) => p.id !== id).slice(0, 4);
            setSimilarProducts(similar);
          });
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        toast.error("Không tìm thấy sản phẩm");
        navigate("/");
      });

    fetch(`http://localhost:9999/reviews?productId=${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [id, navigate]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartCount", JSON.stringify(cartCount));
  }, [cart, cartCount]);

  const handleAddToCart = () => {
    if (!product) return;
    const storedCart = [...cart];
    const index = storedCart.findIndex((item) => item.id === product.id);
    let updatedCart = [];
    let updatedCount = cartCount;
    if (index !== -1) {
      storedCart[index].quantity += 1;
      updatedCart = storedCart;
    } else {
      updatedCart = [...storedCart, { ...product, quantity: 1 }];
      updatedCount++;
    }
    setCart(updatedCart);
    setCartCount(updatedCount);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate(isLogin ? "/cart" : "/verifyorder");
    }, 500);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <StarIcon key={i} style={{ color: "#FFD700" }} />
      ) : (
        <StarBorderIcon key={i} style={{ color: "#ccc" }} />
      )
    );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (!product) {
    return (
      <>
        <Header isLogin={isLogin} setIsLogin={setIsLogin} />
        <Container className="loading-container">
          <p>Đang tải thông tin sản phẩm...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />
      <Container className="product-detail-container">
        <Row className="align-items-center">
          {/* Hình ảnh */}
          <Col md={6} className="text-center">
            <img src={product.image} alt={product.name} className="product-detail-img" />
          </Col>

          {/* Thông tin */}
          <Col md={6}>
            <h2 className="product-name">{product.name}</h2>
            <Badge bg="secondary" className="mb-3">
              H-Tech Store
            </Badge>

            <div className="price-section">
              <span className="price">
                {product.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
              <span className="old-price">
                {((product.price * 100) / 87).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
              <Badge bg="danger">-14%</Badge>
            </div>

            <p className="product-desc">
              <strong>Mô tả:</strong> {product.descreption}
            </p>

            <p>
              <strong>Trạng thái:</strong>{" "}
              <span
                style={{
                  color: product.status === "Còn hàng" ? "green" : "red",
                }}
              >
                {product.status}
              </span>
            </p>
            <p>
              <strong>Số lượng còn:</strong> {product.quantity}
            </p>

            <p>
              <strong>Đánh giá:</strong>{" "}
              {averageRating > 0
                ? `${averageRating.toFixed(1)} / 5.0`
                : "Chưa có"}{" "}
              {renderStars(Math.round(averageRating))}
            </p>

            <div className="action-buttons">
              <Button variant="primary" onClick={handleAddToCart}>
                🛒 Thêm vào giỏ
              </Button>
              <Button variant="success" onClick={handleBuyNow}>
                ⚡ Mua ngay
              </Button>
            </div>

            <div className="extra-buttons">
              <Button variant="info" onClick={() => setShowChat(true)}>
                💬 Chat với shop
              </Button>
              <Button variant="warning" onClick={() => setShowReport(true)}>
                🚨 Báo cáo sản phẩm
              </Button>
            </div>
          </Col>
        </Row>

        {/* Review */}
        {reviews.length > 0 && (
          <Row className="mt-5">
            <Col>
              <h3 className="section-title">Đánh giá sản phẩm</h3>
              {reviews.map((r, i) => (
                <Card key={i} className="review-card">
                  <Card.Body>
                    <div className="review-header">
                      {renderStars(r.rating)}
                      <span className="review-user">
                        {r.userName} - {r.date}
                      </span>
                    </div>
                    <p>{r.review}</p>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        )}

        {/* Sản phẩm tương tự */}
        {similarProducts.length > 0 && (
          <Row className="mt-5">
            <Col>
              <h3 className="section-title">Sản phẩm tương tự</h3>
              <div className="similar-products">
                {similarProducts.map((sp) => (
                  <Card key={sp.id} className="similar-card">
                    <Link to={`/product/${sp.id}/detail`}>
                      <img src={sp.image} alt={sp.name} />
                      <div className="similar-info">
                        <p className="similar-name">{sp.name}</p>
                        <p className="similar-price">
                          {sp.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        )}
      </Container>

      <ChatWithShop show={showChat} handleClose={() => setShowChat(false)} />

      {showReport && (
        <div className="report-modal">
          <ReportProduct />
          <Button variant="secondary" onClick={() => setShowReport(false)}>
            Đóng
          </Button>
        </div>
      )}
      <Footer />
    </>
  );
}

export default ProductDetail;
