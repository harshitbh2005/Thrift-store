import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      await axiosInstance.delete(`/products/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const isOwner = user?.id === product.seller.id;

  return (
    <section className="detail-page">
      <div className="detail-gallery">
        {product.images.length ? (
          product.images.map((image) => (
            <img key={image} src={image} alt={product.title} className="detail-image" />
          ))
        ) : (
          <img
            src="https://via.placeholder.com/600x400?text=No+Image"
            alt={product.title}
            className="detail-image"
          />
        )}
      </div>

      <div className="detail-card">
        <span className="detail-tag">{product.hostelName}</span>
        <h1>{product.title}</h1>
        <p className="price">Rs. {product.price}</p>
        <p>{product.description}</p>

        <div className="seller-card">
          <h3>Seller Details</h3>
          <p>Name: {product.seller.name}</p>
          <p>Email: {product.seller.email}</p>
          <p>
            Location: {product.hostelName}, Room {product.roomNumber}
          </p>
          <p>
            Phone:{" "}
            {isAuthenticated ? product.seller.phoneNumber : <Link to="/login">Login to view</Link>}
          </p>
        </div>

        {isOwner ? (
          <button type="button" className="danger-button" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? "Deleting..." : "Delete Listing"}
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default ProductDetailPage;
