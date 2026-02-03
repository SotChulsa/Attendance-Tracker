import "./styles.css";
import { ButtonComponent } from "@/Components/Buttons/button-component";

const RegisterPage = () => {
  return (
    <div className="login-container">
      <div className="back-btn">←</div>

      <form>
        <h3>Sign in as</h3>
        <div className="sign-in-options">
          <label>
            <input type="checkbox" /> Student
        </label>
          <label>
            <input type="checkbox" /> Teacher
          </label>
        </div>

        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" />

        <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />

        <label htmlFor="repassword">Re-Password</label>
        <input type="password" id="repassword" name="repassword" />

        <ButtonComponent label="Register" type="submit" />
      </form>

      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
        Already have an account? <a href="#">Login</a>
      </p>
    </div>
  );
};

export default RegisterPage;
