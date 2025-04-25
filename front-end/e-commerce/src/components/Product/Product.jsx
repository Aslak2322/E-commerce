import {useEffect, useState } from "react";
import "./Product.css";
import { NavLink } from 'react-router-dom';

function Product( { product, setCartItems }) {

    const addToCart = async () => {
        try {
            const response = await fetch("http://localhost:5001/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: 1,
                    product_id: product.id,
                    quantity: 1
                })
            })
            if (!response.ok) throw new Error("Failed to add item to cart");

            console.log("Added to cart:", product);

            setCartItems((prevCart) => {
                const existingItem = prevCart.find((item) => item.id === product.id);
                if (existingItem) {
                  return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                  );
                } else {
                  return [...prevCart, { ...product, quantity: 1 }];
                }
              });
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/products")
          .then(res => res.json())
          .then(data => setProducts(data))
          .catch(err => console.error("Failed to load products", err));
    }, []);
    
    return (
        <div className="Product-card">
            <h3>{product.name}</h3>
            <div className="box">
              <p>{product.description}</p>
              <img src={product.image} alt={product.name} className="product-image" />
              <p className="product-price">${Number(product.price.replace(/[^0-9.]/g, "")).toFixed(2)}</p>
            <NavLink to={`/details/${product.id}`}>View Details</NavLink>
            </div>
        </div>
    )
}

export default Product;