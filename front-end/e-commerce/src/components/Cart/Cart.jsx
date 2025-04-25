import './Cart.css';
import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

function Cart ({ cartItems, setCartItems }) {
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState(null);

    useEffect(()=> {
        const fetchCart = async () => {
            try {
                const response = await fetch("http://localhost:5001/cart");
                const data = await response.json();
                console.log("Fetched cart data:", data);
                setCartItems(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cart:", error)
            }
        };
        fetchCart();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decode the JWT token
                setUserId(decodedToken.id); // Set the userId from the decoded token
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    useEffect(() => {
        const calculateTotal = () => {
          const totalPrice = (cartItems || []).reduce((acc, item) => {
            if (!item.price) {
                console.warn("Missing price for item:", item);
                return acc;
              }
            const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
            if (isNaN(price)) {
                console.error("Invalid price value:", item.price);
                return acc;
            }

            return acc + (price * item.quantity);
          }, 0);
          setTotal(totalPrice)
        };
        calculateTotal();
    }, [cartItems]);

    const handleClearCart = async () => {
        console.log("Proceeding to checkout with total:", total);

        try {
            await fetch("http://localhost:5001/cart", { method: 'DELETE' });
            setCartItems([]); // Clear cart locally
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const handleCheckout = async () => {
        console.log("cartItems before sending:", cartItems);

        if (!userId) {
            alert("User not logged in. Please log in to proceed with the checkout.");
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await fetch("http://localhost:5001/checkout", {
                method: "POST",
                headers: {"Content-type": "application/json",
                          "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartItems,
                    total,
                    userId,
                })
            });

            if (response.ok) {
                alert("Checkout successful!");
                handleClearCart();
            } else {
                alert("Error processing checkout.");
            }
        } catch (error) {
            console.error("Checkout failed", error);
            alert("There was an error with the checkout. Please try again.");
        }
    };

    if (loading) return <p>Loading cart...</p>;

    return (
        <div className="cart-css">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? ( <p>Cart is empty</p>
            ) : (
            <ul>
                {cartItems.map((item) => (
                    <li key={item.id}>
                        <strong>Product:</strong> {item.name} <br />
                        <strong>Quantity:</strong> {item.quantity} <br />
                        <strong>Price:</strong> {item.price} <br />
                    </li>
                ))}
            </ul>
            )}
            <h3>Total: {total}</h3>
            <button onClick={handleCheckout}>Checkout</button>
            <button onClick={handleClearCart}>Clear Cart</button>
            <footer>Aslak CO 2025</footer>
        </div>
    );
};

export default Cart;
