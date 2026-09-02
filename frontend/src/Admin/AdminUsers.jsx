import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config/api";
import "../styles/adminlist.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    axios
      .get(`${API_BASE}/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;

    axios
      .delete(`${API_BASE}/users/${id}`)
      .then(() => {
        alert("User deleted successfully!");
        getUsers();
      })
      .catch((err) => console.log(err));
  };

  const toggleRole = (user) => {
    const nextRole = user.role === "admin" ? "user" : "admin";

    axios
      .patch(`${API_BASE}/users/${user.id}`, { role: nextRole })
      .then(() => {
        alert(`Role changed to ${nextRole}`);
        getUsers();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>👥 Users</h1>
          <p>Manage all BookNest registered users</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="no-data">No users registered yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || "—"}</td>
                <td>
                  <span className={`badge ${user.role === "admin" ? "badge-admin" : "badge-user"}`}>
                    {user.role || "user"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => toggleRole(user)}
                  >
                    Toggle Role
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
