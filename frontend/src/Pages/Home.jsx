import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/CartSlice";
import axios from "axios";
import "../styles/books.css";

const Home = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products.");
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (loading) {
    return (
      <div className="books-page">
        <h2>Loading Products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="books-page">
        <h2>{error}</h2>
        <p>Make sure JSON Server is running on port 3000.</p>
      </div>
    );
  }

  return (
    <div className="books-page">
      {/* Hero Banner */}
      <div className="home-banner">
        <div className="banner-content">
          <span className="banner-badge">📚 Welcome to BookNest</span>
          <h1>Online Book &amp; Stationery Store</h1>
          <p>
            Discover a wide range of books and stationery essentials — all in
            one place. Shop your favorites today!
          </p>
          <a className="banner-btn" href="#products">
            Shop Now ↓
          </a>
        </div>
        <div className="banner-art">📖 🖊️ ✏️ 📔</div>
      </div>

      {/* All Products */}
      <div className="products-section">
        <div className="books-header">
          <h1>Browse All Products</h1>
          <p>
            Every book and stationery item available in our store. All items are
            displayed below.
          </p>
        </div>
      </div>

      <div className="books-container" id="products">
        {products.length === 0 ? (
          <div className="no-products">
            <h2>No Products Found</h2>
          </div>
        ) : (
          products.map((product) => (
            <div className="book-card" key={product.id}>
              <div className="book-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="book-details">
                <h2>{product.name}</h2>

                <span className="book-category">{product.category}</span>

                <p className="description">{product.description}</p>

                <p className="rating">⭐ {product.rating}</p>

                <h3>₹{product.price}</h3>

                <p>Stock: {product.stock}</p>

                <button
                  className="add-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
