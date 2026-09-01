import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuantityStepper from "../Components/QuantityStepper";
import axios from "axios";
import "../styles/books.css";

const CategoryBooks = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const categoryName = category ? decodeURIComponent(category) : null;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    axios
      .get("http://localhost:5000/products?type=Book")
      .then((response) => {
        if (active) {
          setBooks(response.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("Failed to load books.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = [...new Set(books.map((b) => b.category))];

  const activeCategory = categoryName || "All";

  const filteredBooks = categoryName
    ? books.filter((book) => book.category === categoryName)
    : books;

  if (loading) {
    return (
      <div className="books-page">
        <h2>Loading Books...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="books-page">
        <h2>{error}</h2>
        <p>Make sure JSON Server is running on port 5000.</p>
      </div>
    );
  }

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>{categoryName || "Category"}</h1>
        <p>
          {categoryName
            ? `Browse all ${categoryName.toLowerCase()} books available in our store.`
            : "Browse all books available in our store."}
        </p>
      </div>

      <div className="category-filters">
        <button
          className={`filter-chip ${activeCategory === "All" ? "active" : ""}`}
          onClick={() => navigate("/books")}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${
              activeCategory === cat ? "active" : ""
            }`}
            onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="books-container">
        {filteredBooks.length === 0 ? (
          <div className="no-products">
            <h2>No Books Found</h2>
            <p>No books available in this category yet.</p>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <div className="book-image">
                <img src={book.image} alt={book.name} />
              </div>

              <div className="book-details">
                <h2>{book.name}</h2>

                <span className="book-category">{book.category}</span>

                <p className="description">{book.description}</p>

                <p className="rating">⭐ {book.rating}</p>

                <h3>₹{book.price}</h3>

                <p>Stock: {book.stock}</p>

                <QuantityStepper item={book} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryBooks;
