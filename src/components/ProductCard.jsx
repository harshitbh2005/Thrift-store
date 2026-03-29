import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.images[0] || "https://via.placeholder.com/400x250?text=No+Image"}
          alt={product.title}
          className="product-image"
        />
        <span className="product-badge">{product.hostelName}</span>
      </div>
      <div className="product-card-content">
        <h3>{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <p className="price">Rs. {product.price}</p>
        <p className="product-meta">Room {product.roomNumber}</p>
        <Link to={`/products/${product.id}`} className="primary-button small-button">
          View Details
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
