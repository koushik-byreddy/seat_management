import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  return (
    <>
      <div className="login-form">
        <h1>Logo</h1>
        <div className="content">
          <div className="input-field">
            <input type="email" placeholder="Email" autoComplete="nope" />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
            />
          </div>
          <a href="#" className="link">
            Forgot Your Password?
          </a>
        </div>
        <div className="action">
          <button>Register</button>
          <button onClick={() => navigate("/home")}>Log in</button>
        </div>
      </div>
    </>
  );
}

export default Login;
