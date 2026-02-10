"use client";

import { useState } from "react";
import "./styles.css";
import { ButtonComponent } from "@/Components/Buttons/button-component";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
    role: "student"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "student" || name === "teacher") {
      setFormData(prev => ({
        ...prev,
        role: name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (message) setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      return;
    }
    
    if (formData.password !== formData.repassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }
    
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setMessageType("error");
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Registration successful");
        setMessageType("success");
        
        setFormData({
          name: "",
          email: "",
          password: "",
          repassword: "",
          role: "student"
        });
        
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMessage(`${data.error || "Registration failed"}`);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="back-btn" onClick={() => window.history.back()}>←</div>

      {message && (
        <div>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h3>Sign in as</h3>
        <div className="sign-in-options">
          <label>
            <input 
              type="radio" 
              name="student"
              checked={formData.role === "student"}
              onChange={handleInputChange}
              disabled={loading}
            /> Student
          </label>
          <label>
            <input 
              type="radio" 
              name="teacher"
              checked={formData.role === "teacher"}
              onChange={handleInputChange}
              disabled={loading}
            /> Teacher
          </label>
        </div>

        <label htmlFor="name">Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          value={formData.password}
          onChange={handleInputChange}
          disabled={loading}
          required
          minLength={6}
        />

        <label htmlFor="repassword">Re-Password</label>
        <input 
          type="password" 
          id="repassword" 
          name="repassword" 
          value={formData.repassword}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <ButtonComponent 
          label={loading ? "Registering..." : "Register"} 
          type="submit"
          disabled={loading}
        />
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default RegisterPage;