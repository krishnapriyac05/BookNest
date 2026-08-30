import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const productsCache = useRef([]);
  const cacheLoaded = useRef(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const loggedInAdmin = localStorage.getItem("loggedInAdmin");

    setIsLoggedIn(Boolean(loggedInUser || loggedInAdmin));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInAdmin");
    setIsLoggedIn(false);
    navigate("/home");
  };

  const loadProducts = () => {
    if (cacheLoaded.current) {
      return Promise.resolve(productsCache.current);
    }

    return axios
      .get("http://localhost:3000/products")
      .then((response) => {
        productsCache.current = response.data;
        cacheLoaded.current = true;
        return productsCache.current;
      })
      .catch(() => productsCache.current);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);

    loadProducts().then((products) => {
      const query = term.trim().toLowerCase();

      const matches = products
        .filter((product) =>
          [product.name, product.category, product.type]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(query))
        )
        .slice(0, 6);

      setSearchResults(matches);
    });
  };

  const handleSearchSelect = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (name) => {
    navigate(`/?q=${encodeURIComponent(name)}`);
    setSearchTerm(name);
    setShowResults(false);
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        📚 BookNest
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <Link to="/stationery">Stationery</Link>
        <Link to="/categories">Categories</Link>
      </div>

      <div className="nav-actions">

        <div className="search-wrapper">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search books, stationery..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSelect(e);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowResults(false), 150);
              }}
            />
            <button type="button" onClick={handleSearchSelect}>
              🔍
            </button>
          </div>

          {showResults && (
            <div className="search-results">
              {searchResults.length === 0 ? (
                <div className="search-no-results">
                  No products found
                </div>
              ) : (
                searchResults.map((product) => (
                  <div
                    className="search-result-item"
                    key={product.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleResultClick(product.name);
                    }}
                  >
                    <img src={product.image} alt={product.name} />
                    <div className="search-result-info">
                      <span className="search-result-name">
                        {product.name}
                      </span>
                      <span className="search-result-meta">
                        {product.category} · ₹{product.price}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <Link to="/cart">🛒 Cart</Link>

        {isLoggedIn ? (
          <Link to="/profile">👤 Profile</Link>
        ) : null}

        {isLoggedIn ? (
          <button
            className="nav-logout"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}

      </div>

    </nav>
  );
};

export default Nav;