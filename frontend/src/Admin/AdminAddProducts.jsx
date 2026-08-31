import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/adminaddproducts.css";

const AdminAddProducts = () => {
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

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/products", {
        ...product,
        price: Number(product.price),
        rating: Number(product.rating),
        stock: Number(product.stock),
      })
      .then((response) => {
        console.log("Product added:", response.data);

        setMessage("Product added successfully!");

        setProduct({
          name: "",
          type: "Book",
          category: "",
          price: "",
          rating: "",
          description: "",
          image: "",
          stock: "",
        });
      })
      .catch((error) => {
        console.log("Error adding product:", error);
        setMessage("Failed to add product.");
      });
  };

  return (
    <div className="admin-add-product-page">

      <div className="admin-add-product-header">
        <div>
          <h1>➕ Add Product</h1>
          <p>Add books and stationery products to BookNest</p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      <div className="product-form-card">

        <h2>Product Information</h2>

        <form onSubmit={handleSubmit}>

          {/* Product Name and Type */}
          <div className="form-row">

            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
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

          {/* Category */}
          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              {product.type === "Book" ? (
                <>
                  <option value="Moral Stories">Moral Stories</option>
                  <option value="Story Books">Story Books</option>
                  <option value="Knowledge & Wisdom">
                    Knowledge & Wisdom
                  </option>
                  <option value="Spiritual & Religious">
                    Spiritual & Religious
                  </option>
                  <option value="Academic Books">
                    Academic Books
                  </option>
                  <option value="Children's Books">
                    Children's Books
                  </option>
                  <option value="Self Development">
                    Self Development
                  </option>
                  <option value="Novels & Literature">
                    Novels & Literature
                  </option>
                  <option value="Competitive Exam Books">
                    Competitive Exam Books
                  </option>
                  <option value="Science & Technology">
                    Science & Technology
                  </option>
                </>
              ) : (
                <>
                  <option value="Notebooks">Notebooks</option>
                  <option value="Pens">Pens</option>
                  <option value="Pencils">Pencils</option>
                  <option value="Colour Pens">Colour Pens</option>
                  <option value="Colour Pencils">Colour Pencils</option>
                  <option value="Art Supplies">Art Supplies</option>
                  <option value="School Supplies">
                    School Supplies
                  </option>
                  <option value="Office Supplies">
                    Office Supplies
                  </option>
                  <option value="Geometry">Geometry</option>
                  <option value="Glue & Tape">Glue &amp; Tape</option>
                  <option value="Labels & Book Covers">
                    Labels &amp; Book Covers
                  </option>
                  <option value="Papers">Papers</option>
                  <option value="Charts">Charts</option>
                  <option value="School Accessories">
                    School Accessories
                  </option>
                </>
              )}
            </select>
          </div>

          {/* Price, Rating, Stock */}
          <div className="form-row three-columns">

            <div className="form-group">
              <label>Price (₹)</label>

              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={product.price}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Rating</label>

              <input
                type="number"
                name="rating"
                placeholder="Example: 4.5"
                value={product.rating}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                placeholder="Available stock"
                value={product.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

          </div>

          {/* Description */}
          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter product description"
              value={product.description}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>

          </div>

          {/* Image */}
          <div className="form-group">

            <label>Product Image</label>

            <input
              type="text"
              name="image"
              placeholder="Example: /images/bhagavad-gita.jpg"
              value={product.image}
              onChange={handleChange}
              required
            />

            <small>
              We will add the BookNest product images separately.
            </small>

          </div>

          {message && (
            <div className="product-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="add-product-btn"
          >
            ➕ Add Product
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminAddProducts;