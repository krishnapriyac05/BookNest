import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuantityStepper from "../Components/QuantityStepper";
import axios from "axios";
import "../styles/books.css";

const CategoryBooks = () => {
  const { category } = useParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryName = category ? decodeURIComponent(category) : "";

  const [prevCategory, setPrevCategory] = useState(categoryName);
  if (categoryName !== prevCategory) {
    setPrevCategory(categoryName);
    setBooks([]);
    setLoading(true);
    setError("");
  }

  useEffect(() => {
    let active = true;

    axios
      .get(
        `http://localhost:5000/products?type=Book&category=${encodeURIComponent(
          categoryName
        )}`
      )
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
  }, [categoryName]);

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
        <h1>{categoryName}</h1>
        <p>
          Browse all {categoryName.toLowerCase()} books available in our store.
        </p>
      </div>

      <div className="books-container">
        {books.length === 0 ? (
          <div className="no-products">
            <h2>No Books Found</h2>
            <p>No books available in this category yet.</p>
          </div>
        ) : (
          books.map((book) => (
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
