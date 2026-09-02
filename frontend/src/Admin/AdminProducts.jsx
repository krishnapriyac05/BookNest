import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../config/api";
import "../styles/adminproducts.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Get products from JSON Server
  const getProducts = () => {
    axios
      .get(`${API_BASE}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log("Error fetching products:", error);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Delete product
  const deleteProduct = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    axios
      .delete(`${API_BASE}/products/${id}`)
      .then(() => {
        alert("Product deleted successfully!");
        getProducts();
      })
      .catch((error) => {
        console.log("Error deleting product:", error);
      });
  };

  return (
    <div className="admin-products-page">

      {/* Header */}
      <div className="admin-products-header">
        <div>
          <h1>Products</h1>
          <p>Manage all BookNest books and stationery products</p>
        </div>

        <div className="admin-products-actions">
          <button
            className="dashboard-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>

          <Link
            to="/admin/add-products"
            className="add-product-link"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Product Count */}
      <div className="product-count">
        Total Products: <strong>{products.length}</strong>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📚</div>

          <h2>No Products Found</h2>

          <p>
            You haven't added any products yet.
          </p>

          <Link
            to="/admin/add-products"
            className="add-first-product"
          >
            + Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="admin-product-grid">

          {products.map((product) => (
            <div
              className="admin-product-card"
              key={product.id}
            >

              {/* Image */}
              <div className="admin-product-image">

                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <span>📚</span>
                )}

              </div>

              {/* Details */}
              <div className="admin-product-details">

                <span className="product-type">
                  {product.type}
                </span>

                <h2>{product.name}</h2>

                <p className="product-category">
                  {product.category}
                </p>

                <p className="product-description">
                  {product.description}
                </p>

                <div className="product-info-row">

                  <strong>
                    ₹{product.price}
                  </strong>

                  <span>
                    ⭐ {product.rating}
                  </span>

                </div>

                <p className="stock">
                  Stock: <strong>{product.stock}</strong>
                </p>

                {/* Buttons */}
                <div className="product-buttons">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/admin/update-products/${product.id}`)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(product.id)}
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default AdminProducts;