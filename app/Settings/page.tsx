"use client";

import { ButtonComponent } from "@/Components/Buttons/button-component";
import './setting.css';

export default function SettingsPage() {
  const handleSaveChanges = () => {
    console.log("Save changes clicked");
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
  };


  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Profile/Settings</h1>
        <div className="profile-icon-large">
          <div className="profile-avatar-large">
            <img src="https://img.icons8.com/?size=100&id=77883&format=png&color=000000" alt="Profile"/>
          </div>
        </div>
      </header>

      <div className="settings-form-container">
        <form className="settings-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-group">
              <input 
                type="password" 
                id="password"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" className="form-select">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input 
              type="date" 
              id="dob"
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <ButtonComponent 
              label="Save Changes"
              onClick={handleSaveChanges}
            />
          </div>
        </form>
      </div>
    </div>
  );
}