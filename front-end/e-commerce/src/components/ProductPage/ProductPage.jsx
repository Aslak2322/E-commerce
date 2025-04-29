import './ProductPage.css';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product.jsx';
import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function ProductPage({ cartItems, setCartItems }) {
    const { category } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
      let apiUrl = `${API_URL}/products`

      if (category) {
        apiUrl += `?category=${category}`;
      }

      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched products:", data)
          setProducts(data)})
        .catch((err) => console.error("Failed to load products", err));
    }, [category])


    return (
      <div className="product-page">
        <h1>{category ? `Category: ${category}` : "All Products"}</h1>
        {products.length > 0 ? (
          <div className="product-list">
            {products.map((product) => (
              <Product key={product.id} product={product} setCartItems={setCartItems} cartItems={cartItems} />
            ))}
          </div>
        ) : (
          <h2>No products found for this category.</h2>
        )}
      </div>
    );
  }

export default ProductPage;