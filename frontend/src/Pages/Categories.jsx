import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE from "../config/api";
import "../styles/books.css";

const getCategoryLink = (category, type) =>
  type === "Book"
    ? `/category/${encodeURIComponent(category)}`
    : `/stationery/${encodeURIComponent(category)}`;

const CategorySection = ({ title, categories, type }) => (
  <div
    style={{
      background: "white",
      borderRadius: "14px",
      padding: "25px",
      marginBottom: "25px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
      maxWidth: "900px",
      margin: "0 auto 25px",
    }}
  >
    <h2
      style={{
        color: "#172554",
        marginTop: 0,
        borderBottom: "2px solid #eef2f7",
        paddingBottom: "12px",
      }}
    >
      {title}
    </h2>

    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginTop: "15px",
      }}
    >
      {categories.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No categories found.</p>
      ) : (
        categories.map((category) => (
          <Link
            key={category}
            to={getCategoryLink(category, type)}
            style={{
              padding: "10px 20px",
              background: "#eff6ff",
              color: "#1d4ed8",
              borderRadius: "25px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "14px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2563eb";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#eff6ff";
              e.currentTarget.style.color = "#1d4ed8";
            }}
          >
            {category}
          </Link>
        ))
      )}
    </div>
  </div>
);

const Categories = () => {
  const [books, setBooks] = useState([]);
  const [stationery, setStationery] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/products?type=Book`)
      .then((res) => setBooks(res.data))
      .catch(() => {});

    axios
      .get(`${API_BASE}/products?type=Stationery`)
      .then((res) => setStationery(res.data))
      .catch(() => {});
  }, []);

  const bookCategories = [...new Set(books.map((b) => b.category))];
  const stationeryCategories = [
    ...new Set(stationery.map((s) => s.category)),
  ];

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>📚 Categories</h1>
        <p>Browse books and stationery by category</p>
      </div>

      <CategorySection
        title="Book Categories"
        categories={bookCategories}
        type="Book"
      />

      <CategorySection
        title="Stationery Categories"
        categories={stationeryCategories}
        type="Stationery"
      />
    </div>
  );
};

export default Categories;
