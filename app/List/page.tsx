"use client";

import { useEffect, useState } from "react";
import { ButtonComponent } from "@/Components/Buttons/button-component";
import "./main.css";

type User = {
  id: string;
  name: string;
  role: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users");
    }
  };


  const handleSearchByRole = () => {
    setSearchValue("student");
  };

  const handleSearchById = () => {
    console.log("Search by ID clicked");
  };

  const handleSearchByName = () => {
    console.log("Search by Name clicked");
  };

  const handleSearchByClass = () => {
    console.log("Search by Class clicked");
  };

  const handleSearch = () => {
    console.log("Search clicked");
  };

  const handleClear = () => {
    setSearchValue("");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.role.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.id.toString().includes(searchValue)
  );

  return (
    <div className="user-management-container">
      <header className="user-header">
        <div className="welcome-section">
          <h1>Welcome, Sot Chulsa</h1>
          <div className="profile-avatar">
            <img
              src="https://img.icons8.com/?size=100&id=77883&format=png&color=000000"
              alt="Profile"
            />
          </div>
        </div>
      </header>

      <section className="search-buttons-section">
        <div className="search-buttons-grid">
          <div className="search-option-btn">
            <ButtonComponent
              label="Search by Role"
              onClick={handleSearchByRole}
            />
          </div>

          <div className="search-option-btn">
            <ButtonComponent
              label="Search by ID"
              onClick={handleSearchById}
            />
          </div>

          <div className="search-option-btn">
            <ButtonComponent
              label="Search by Name"
              onClick={handleSearchByName}
            />
          </div>

          <div className="search-option-btn">
            <ButtonComponent
              label="Search by Class"
              onClick={handleSearchByClass}
            />
          </div>
        </div>
      </section>

      <section className="search-input-section">
        <div className="search-container">
          <input
            placeholder="🔎︎"
            type="text"
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </section>

      <section className="users-table-section">
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3}>No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      <span
                        className={`role-badge ${user.role.toLowerCase()}`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
