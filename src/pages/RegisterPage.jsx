import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  personalEmail: "",
  password: "",
  phoneNumber: "",
  hostelName: "",
  roomNumber: ""
};

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState(initialForm);
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
      const { data } = await axiosInstance.post("/auth/register", formData);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrapper">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <p className="form-helper">Register with your `@gla.ac.in` email. Your personal email is stored separately and is not used for authentication.</p>
        {error ? <p className="error-text">{error}</p> : null}

        <input name="name" placeholder="Full name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="GLA email (@gla.ac.in)" onChange={handleChange} required />
        <input name="personalEmail" type="email" placeholder="Personal email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="phoneNumber" placeholder="Phone number" onChange={handleChange} required />
        <input name="hostelName" placeholder="Hostel name" onChange={handleChange} required />
        <input name="roomNumber" placeholder="Room number" onChange={handleChange} required />

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default RegisterPage;
