"use client";

import { useEffect, useState } from "react";
import { ButtonComponent } from "@/Components/Buttons/button-component";
import "./setting.css";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");
    const res = await fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setRole(data.user.role);
      setDob(data.user.dob || "");
    }
  };
  const handleSaveChanges = async (e: any) => {
    e.preventDefault();
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");
    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        password: password || undefined,
        dob,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Profile updated successfully");
      setPassword("");
    } else {
      setMessage(data.message || "Update failed");
    }
  };
  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Profile / Settings</h1>
        <div className="top-right">
          <nav className="nav-links">
            <a href="/Dashboard">Dashboard</a>
            <a href="/List">List</a>
            <a href="/Attendance">Attendance</a>
            <a href="/Settings">Settings</a>
            <a href="/Classes">Classes</a>
          </nav>
    <div className="profile-avatar-large">
      <img
        src="https://img.icons8.com/?size=100&id=77883&format=png&color=000000"
        alt="Profile"
      />
    </div>
  </div>
</header>
      {message && <p className="message">{message}</p>}
      <div className="settings-form-container">
        <form className="settings-form" onSubmit={handleSaveChanges}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              className="form-select"
              value={role}
              disabled
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              className="form-input"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <ButtonComponent label="Save Changes" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
