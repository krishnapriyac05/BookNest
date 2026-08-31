import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminlist.css";

const CategoryBlock = ({ title, categories, products, type }) => (
  <div style={{ marginBottom: "30px" }}>
    <h2 style={{ color: "#172554", marginBottom: "15px" }}>{title}</h2>

    <table className="admin-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Products</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.length === 0 ? (
          <tr>
            <td colSpan="3" style={{ textAlign: "center", color: "#94a3b8" }}>
              No categories found.
            </td>
          </tr>
        ) : (
          categories.map((category) => {
            const count = products.filter(
              (p) => p.category === category && p.type === type
            ).length;

            return (
              <tr key={category}>
                <td>{category}</td>
                <td>{count}</td>
                <td>
                  <button
                    className="btn btn-delete"
                    onClick={() => {
                      const toDelete = products.filter(
                        (p) => p.category === category && p.type === type
                      );

                      if (
                        !window.confirm(
                          `Delete category "${category}" and its ${toDelete.length} product(s)?`
                        )
                      ) {
                        return;
                      }

                      Promise.all(
                        toDelete.map((p) =>
                          axios.delete(
                            `http://localhost:5000/products/${p.id}`
                          )
                        )
                      )
                        .then(() => {
                          alert("Category deleted!");
                          window.location.reload();
                        })
                        .catch((err) => console.log(err));
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

const AdminCategories = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const bookCategories = [
    ...new Set(
      products.filter((p) => p.type === "Book").map((p) => p.category)
    ),
  ];

  const stationeryCategories = [
    ...new Set(
      products
        .filter((p) => p.type === "Stationery")
        .map((p) => p.category)
    ),
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>📚 Categories</h1>
          <p>Manage book and stationery categories</p>
        </div>
      </div>

      <CategoryBlock
        title="Book Categories"
        categories={bookCategories}
        products={products}
        type="Book"
      />

      <CategoryBlock
        title="Stationery Categories"
        categories={stationeryCategories}
        products={products}
        type="Stationery"
      />
    </div>
  );
};

export default AdminCategories;
