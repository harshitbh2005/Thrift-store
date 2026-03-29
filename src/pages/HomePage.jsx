import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (filters.search.trim()) params.search = filters.search.trim();

      const { data } = await axiosInstance.get("/products", { params });
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchProducts();
  };

  return (
    <section>
      <div className="hero">
        <div>
          <span className="eyebrow">Campus marketplace</span>
          <h1>Buy and sell within your university, without the noise.</h1>
          <p>Search products quickly and connect directly with student sellers on campus.</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <strong>{products.length}</strong>
            <span>Active listings</span>
          </div>
          <div className="stat-card">
            <strong>Hostel-first</strong>
            <span>Easy campus pickup</span>
          </div>
        </div>
      </div>

      <form className="filters" onSubmit={handleFilterSubmit}>
        <div className="search-field">
          <input
            name="search"
            placeholder="Search by product title or description"
            value={filters.search}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="primary-button">
          Search
        </button>
      </form>

      {loading ? <p>Loading products...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !products.length ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try a different keyword and check again.</p>
        </div>
      ) : null}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default HomePage;
