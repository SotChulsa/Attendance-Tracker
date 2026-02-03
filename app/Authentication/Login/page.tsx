import "./style.css";
import { ButtonComponent } from "@/Components/Buttons/button-component";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="back-btn">←</div>

      <div className="logo">
      <img src="/tracker-logo.png" alt="Attendance Tracker Logo" />
      </div>

      <form>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />

        <div className="login-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot your password?</a>
        </div>

        <ButtonComponent label="Continue" type="submit" />
      </form>

      <div className="divider">Or continue with</div>

      <div className="social-login">
        <img src="/Google-Symbol.png" alt="Google" />
        <img src="/apple-logo.png" alt="Apple" />
        <img src="/facebook-color.png" alt="Facebook" />
        <img src="/twitter-logo.png" alt="Twitter" />
      </div>
    </div>
  );
};

export default LoginPage;
