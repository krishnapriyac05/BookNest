import React, { useEffect, useState } from "react";
import QuantityStepper from "../Components/QuantityStepper";
import axios from "axios";
import "../styles/stationery.css";

const Stationery = () => {
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

        <h1>Stationery</h1>

        <p>
          Explore our collection of notebooks, pens,
          pencils and essential stationery products.
        </p>

      </div>


      {/* Products */}

      <div className="stationery-container">

        {stationeryProducts.length === 0 ? (

          <div className="no-products">
            <h2>No Stationery Products Found</h2>
          </div>

        ) : (

          stationeryProducts.map((product) => (

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