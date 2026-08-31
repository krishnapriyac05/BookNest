import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuantityStepper from "../Components/QuantityStepper";
import axios from "axios";
import "../styles/books.css";

const Books = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/products?type=Book")
      .then((response) => {
        const data = response.data;
        setBooks(data);

        const uniqueCategories = [
          "All",
          ...new Set(data.map((book) => book.category)),
        ];

        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load books.");
        setLoading(false);
      });
  }, []);

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((book) => book.category === selectedCategory);

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
        <p>Make sure JSON Server is running on port 3000.</p>
      </div>
    );
  }

  return (
    <div className="books-page">

      <div className="books-header">
        <h1>Books</h1>
        <p>
          Explore our collection of books across many categories.
        </p>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-chip ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => {
              if (category === "All") {
                setSelectedCategory("All");
              } else {
                navigate(`/category/${encodeURIComponent(category)}`);
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Books */}
      <div className="books-container">
        {filteredBooks.length === 0 ? (
          <div className="no-products">
            <h2>No Books Found</h2>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <div className="book-image">
                <img src={book.image} alt={book.name} />
              </div>

              <div className="book-details">
                <h2>{book.name}</h2>

                <span className="book-category">
                  {book.category}
                </span>

                <p className="description">
                  {book.description}
                </p>

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

export default Books;
