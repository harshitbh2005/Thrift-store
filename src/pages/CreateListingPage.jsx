import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function CreateListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    images: []
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "images") {
      setFormData((prev) => ({ ...prev, images: Array.from(files) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("price", formData.price);

      formData.images.forEach((image) => {
        payload.append("images", image);
      });

      const { data } = await axiosInstance.post("/products", payload, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      navigate(`/products/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrapper">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Create Listing</h1>
        <p className="form-helper">Your hostel and room are pulled from your profile so buyers know where pickup is easiest.</p>
        {error ? <p className="error-text">{error}</p> : null}

        <input name="title" placeholder="Product title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" rows="5" onChange={handleChange} required />
        <input name="price" type="number" min="0" placeholder="Price" onChange={handleChange} required />
        <input name="hostelDisplay" value={user?.hostelName || ""} disabled />
        <input name="roomDisplay" value={user?.roomNumber || ""} disabled />
        <input name="images" type="file" accept="image/*" multiple onChange={handleChange} />
        {formData.images.length ? (
          <p className="file-count">{formData.images.length} image(s) selected</p>
        ) : null}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </section>
  );
}

export default CreateListingPage;
