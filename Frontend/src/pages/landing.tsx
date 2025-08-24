import "../App.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <img
            src="/public/logo_connect.svg"
            alt="Logo"
            height="100px"
            width="200px"
          />
        </div>
        <div className="navlist">
          <p>Join as guest</p>
          <p>Register</p>

          <Link to="/login" className="loginBtn">
            <p>Login</p>
          </Link>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1 className="heading">
            Limitless connection and collaboration <br /> with ConnectRight
          </h1>

          <Link to="/login" className="loginBtn">
            <p>Get Started</p>
          </Link>
        </div>

        <div className="heroImg">
          <img src="/public/hero.png" alt="Hero" height="500px" width="800px" />
        </div>
      </div>
    </div>
  );
}
