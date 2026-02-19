"use client";

import { useEffect, useState } from "react";
import { ButtonComponent } from "@/Components/Buttons/button-component";
import "./main.css";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  role: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<
    "all" | "role" | "id" | "name" | "class"
  >("all");

  useEffect(() => {
    fetchUsers();
      const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (storedUser) {
    setCurrentUser(JSON.parse(storedUser));
  }
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

  //search handlers for different criteria
  const handleSearchByRole = () => {
    setSearchType("role");
    setSearchValue("");
  };

  const handleSearchById = () => {
    setSearchType("id");
    setSearchValue("");
  };

  const handleSearchByName = () => {
    setSearchType("name");
    setSearchValue("");
  };

  const handleSearchByClass = () => {
    setSearchType("class");
    setSearchValue("");
  };

  const handleClear = () => {
    setSearchType("all");
    setSearchValue("");
  };

  //dilter users based on search type and value
  const filteredUsers = users.filter((user) => {
    if (!searchValue) return true;

    switch (searchType) {
      case "role":
        return user.role
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      case "id":
        return user.id.toString().includes(searchValue);

      case "name":
        return user.name
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      case "class":
        // Placeholder until class relation is implemented
        return true;

      default:
        return (
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.role.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.id.toString().includes(searchValue)
        );
    }
  });

  return (
    <div className="user-management-container">
      <header className="user-header">
        <div className="top-row">
          <nav className="nav-links">
            <Link href="/Dashboard">Dashboard</Link>
            <Link href="/List">List</Link>
            <Link href="/Attendance">Attendance</Link>
            <Link href="/Settings">Settings</Link>
            <Link href="/Classes">Classes</Link>
          </nav>
          <div className="welcome-section">
            <h1>Welcome, Bari Quixote</h1>
            <div className="profile-avatar">
              <img
                src="https://img.icons8.com/?size=100&id=77883&format=png&color=000000"
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </header>
      <section className="search-buttons-section">
        <div className="search-buttons-grid">
          <div className="search-option-btn">
            <ButtonComponent label="Search by Role" onClick={handleSearchByRole} />
          </div>

          <div className="search-option-btn">
            <ButtonComponent label="Search by ID" onClick={handleSearchById} />
          </div>

          <div className="search-option-btn">
            <ButtonComponent label="Search by Name" onClick={handleSearchByName} />
          </div>

          <div className="search-option-btn">
            <ButtonComponent label="Search by Class" onClick={handleSearchByClass} />
          </div>

          <div className="search-option-btn">
            <ButtonComponent label="Clear" onClick={handleClear} />
          </div>
        </div>
      </section>

      <section className="search-input-section">
        <div className="search-container">
          <input
            placeholder={`Search by ${searchType}`}
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
