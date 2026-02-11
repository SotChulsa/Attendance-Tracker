"use client";

import { useState } from "react";
import "./style.css";
import { ButtonComponent } from "@/Components/Buttons/button-component";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    if (message) setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setMessage("Please enter email and password");
      setMessageType("error");
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember: formData.remember
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Login successful! Redirecting");
        setMessageType("success");
        
        if (formData.remember) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }
        
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setMessage(`${data.error || "Login failed"}`);
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

      <div className="logo">
        <img src="https://icons.veryicon.com/png/o/education-technology/smart-campus-2/class-attendance.png" alt="Attendance Tracker Logo" />
      </div>

      {message && (
        <div>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
        />

        <div className="login-options">
          <label>
            <input 
              type="checkbox" 
              name="remember"
              checked={formData.remember}
              onChange={handleInputChange}
              disabled={loading}
            /> Remember me
          </label>
          <a href="#">Forgot your password?</a>
        </div>

        <ButtonComponent 
          label={loading ? "Logging in" : "Continue"} 
          type="submit"
          disabled={loading}
        />
      </form>

      <div className="divider">Or continue with</div>

      <div className="social-login">
        <img src="https://logos-world.net/wp-content/uploads/2020/09/Google-Symbol.png" alt="Google" />
        <img src="https://th.bing.com/th/id/R.fe099dad9c1908c2520be9c7c752f7ee?rik=%2b0riBowoEIIxeQ&pid=ImgRaw&r=0" alt="Apple" />
        <img src="https://freepnglogo.com/images/all_img/facebook-logo.png" alt="Facebook" />
        <img src="https://static.vecteezy.com/system/resources/previews/027/395/710/non_2x/twitter-brand-new-logo-3-d-with-new-x-shaped-graphic-of-the-world-s-most-popular-social-media-free-png.png" alt="Twitter" />
      </div>

      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default LoginPage;