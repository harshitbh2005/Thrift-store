import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/auth/login", formData);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrapper">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="form-helper">Log in with your `@gla.ac.in` email to post listings and view seller phone numbers.</p>
        {error ? <p className="error-text">{error}</p> : null}

        <input name="email" type="email" placeholder="GLA email (@gla.ac.in)" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          New user? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
