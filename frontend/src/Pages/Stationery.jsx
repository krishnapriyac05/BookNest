import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuantityStepper from "../Components/QuantityStepper";
import axios from "axios";
import "../styles/stationery.css";
import "../styles/books.css";

const Stationery = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const categoryName = category ? decodeURIComponent(category) : null;

  const [stationeryProducts, setStationeryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/products?type=Stationery")
      .then((response) => {
        console.log("Stationery Products:", response.data);

        setStationeryProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching stationery products:", error);

        setError("Failed to load stationery products.");
        setLoading(false);
      });
  }, []);

  const categories = [
    ...new Set(stationeryProducts.map((p) => p.category)),
  ];

  const activeCategory = categoryName || "All";

  const filteredProducts = categoryName
    ? stationeryProducts.filter(
        (product) => product.category === categoryName
      )
    : stationeryProducts;

  if (loading) {
    return (
      <div className="stationery-page">
        <h2>Loading Stationery Products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stationery-page">
        <h2>{error}</h2>
        <p>Make sure JSON Server is running on port 3000.</p>
      </div>
    );
  }

  return (
    <div className="stationery-page">

      {/* Header */}

      <div className="stationery-header">

        <h1>{categoryName || "Stationery"}</h1>

        <p>
          {categoryName
            ? `Browse all ${categoryName} stationery available in our store.`
            : `Explore our collection of notebooks, pens,
              pencils and essential stationery products.`}
        </p>

      </div>

      {/* Category Filters */}

      <div className="category-filters">
        <button
          className={`filter-chip ${
            activeCategory === "All" ? "active" : ""
          }`}
          onClick={() => navigate("/stationery")}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${
              activeCategory === cat ? "active" : ""
            }`}
            onClick={() =>
              navigate(`/stationery/${encodeURIComponent(cat)}`)
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}

      <div className="stationery-container">

        {filteredProducts.length === 0 ? (

          <div className="no-products">
            <h2>No Stationery Products Found</h2>
          </div>

        ) : (

          filteredProducts.map((product) => (

            <div
              className="stationery-card"
              key={product.id}
            >

              {/* Image */}

              <div className="stationery-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

              </div>

              {/* Details */}

              <div className="stationery-details">

                <h2>
                  {product.name}
                </h2>

                <span className="book-category">
                  {product.category}
                </span>

                <p className="description">
                  {product.description}
                </p>

                <p className="rating">
                  ⭐ {product.rating}
                </p>

                <h3>
                  ₹{product.price}
                </h3>

                <p>
                  Stock: {product.stock}
                </p>

                <QuantityStepper item={product} />

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default Stationery;