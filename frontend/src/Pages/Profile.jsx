import { Link } from "react-router-dom";
import "../styles/profile.css";

const Profile = () => {
  const storedUser = localStorage.getItem("loggedInUser");

  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }

  return (
    <div className="profile-page">

      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <p>Your BookNest account details</p>
      </div>

      {!user ? (
        <div className="profile-login-prompt">
          <h2>You are not logged in</h2>
          <p>
            Please <Link to="/login">login</Link> or{" "}
            <Link to="/register">register</Link> to view your profile.
          </p>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-avatar">👤</div>

          <div className="profile-field">
            <label>Name</label>
            <div>{user.name}</div>
          </div>

          <div className="profile-field">
            <label>Email</label>
            <div>{user.email}</div>
          </div>

          <div className="profile-field">
            <label>Phone</label>
            <div>{user.phone || "—"}</div>
          </div>

          <div className="profile-field">
            <label>Address</label>
            <div>{user.address || "—"}</div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
