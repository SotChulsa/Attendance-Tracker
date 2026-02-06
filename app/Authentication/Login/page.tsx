import "./style.css";
import { ButtonComponent } from "@/Components/Buttons/button-component";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="back-btn">←</div>

      <div className="logo">
      <img src="https://icons.veryicon.com/png/o/education-technology/smart-campus-2/class-attendance.png" alt="Attendance Tracker Logo" />
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
        <img src="https://logos-world.net/wp-content/uploads/2020/09/Google-Symbol.png" alt="Google" />
        <img src="https://th.bing.com/th/id/R.fe099dad9c1908c2520be9c7c752f7ee?rik=%2b0riBowoEIIxeQ&pid=ImgRaw&r=0" alt="Apple" />
        <img src="https://freepnglogo.com/images/all_img/facebook-logo.png" alt="Facebook" />
        <img src="https://static.vecteezy.com/system/resources/previews/027/395/710/non_2x/twitter-brand-new-logo-3-d-with-new-x-shaped-graphic-of-the-world-s-most-popular-social-media-free-png.png" alt="Twitter" />
      </div>
    </div>
  );
};

export default LoginPage;
