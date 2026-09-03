import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE from "../config/api";
import "../styles/adminupdateproducts.css";

const AdminUpdateProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    type: "Book",
    category: "",
    price: "",
    rating: "",
    description: "",
    image: "",
    stock: "",
  });

  useEffect(() => {
    axios
      .get(`${API_BASE}/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log("Error fetching product:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`${API_BASE}/products/${id}`, {
        ...product,
        price: Number(product.price),
        rating: Number(product.rating),
        stock: Number(product.stock),
      })
      .then(() => {
        alert("Product updated successfully!");
        navigate("/admin/products");
      })
      .catch((error) => {
        console.log("Error updating product:", error);
      });
  };

  return (
    <div className="admin-update-page">

      <div className="update-header">
        <div>
          <h1>✏️ Update Product</h1>
          <p>Edit BookNest product information</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/admin/products")}
        >
          ← Products
        </button>
      </div>

      <div className="update-card">

        <h2>Product Information</h2>

        <form onSubmit={handleUpdate}>

          <div className="update-row">

            <div className="update-group">
              <label>Product Name</label>

              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="update-group">
              <label>Product Type</label>

              <select
                name="type"
                value={product.type}
                onChange={handleChange}
              >
                <option value="Book">Book</option>
                <option value="Stationery">Stationery</option>
              </select>
            </div>

          </div>

          <div className="update-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="update-row three">

            <div className="update-group">
              <label>Price (₹)</label>

              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="update-group">
              <label>Rating</label>

              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                step="0.1"
                value={product.rating}
                onChange={handleChange}
                required
              />
            </div>

            <div className="update-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="update-group">
            <label>Description</label>

            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="update-group">
            <label>Product Image</label>

            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="update-product-button"
          >
            ✓ Update Product
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminUpdateProducts;