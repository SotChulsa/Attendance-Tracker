"use client";
import { ButtonComponent } from "@/Components/Buttons/button-component";
import './main.css';

export default function UserManagementPage() {
  const users = [
    { id: 1, name: "Sot Chulsa", role: "Student" },
    { id: 2, name: "Catherine Hammington", role: "Teacher" },
    { id: 3, name: "Michael Yuri", role: "Teacher" },
    { id: 4, name: "Sothireak Mom", role: "Student" },
    { id: 5, name: "Hyoekbeak Jeoung", role: "Student" },
  ];

  const handleSearchByRole = () => {
    console.log("Search by Role clicked");
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
    console.log("Clear clicked");
  };

  return (
    <div className="user-management-container">
      <header className="user-header">
        <div className="welcome-section">
          <h1>Welcome, Sot Chulsa</h1>
            <div className="profile-avatar">
          <img src="https://img.icons8.com/?size=100&id=77883&format=png&color=000000" alt="Profile"/>
          </div>
        </div>
      </header>

      <section className="search-buttons-section">
        <div className="search-buttons-grid">
          <div className="search-option-btn">
            <span className="btn-icon"></span>
            <ButtonComponent 
              label="Search by Role"
              onClick={handleSearchByRole}
            />
          </div>
          
          <div className="search-option-btn">
            <span className="btn-icon"></span>
            <ButtonComponent 
              label="Search by ID"
              onClick={handleSearchById}
            />
          </div>
          <div className="search-option-btn">
            <span className="btn-icon"></span>
            <ButtonComponent 
              label="Search by Name"
              onClick={handleSearchByName}
            />
          </div>
          
          <div className="search-option-btn">
            <span className="btn-icon"></span>
            <ButtonComponent 
              label="Search by Class"
              onClick={handleSearchByClass}
            />
          </div>
        </div>
      </section>
      <section className="search-input-section">
        <div className="search-container">
          <input placeholder="🔎︎"
            type="text" 
            className="search-input"
          />
        </div>
        </section>
      <section className="users-table-section">
        <div className="table-header">
        </div>
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}