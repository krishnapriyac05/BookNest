import { useState } from "react";
import "../styles/adminlist.css";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "BookNest",
    contactEmail: "admin@gmail.com",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved!");
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>⚙️ Settings</h1>
          <p>Manage store information</p>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Store Name</label>
          <input
            type="text"
            name="storeName"
            value={settings.storeName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={settings.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={settings.address}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="settings-btn">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
