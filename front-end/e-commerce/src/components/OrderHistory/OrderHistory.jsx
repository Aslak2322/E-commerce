import { useEffect, useState } from "react";
import "./OrderHistory.css";

const API_URL = process.env.REACT_APP_API_URL;


function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchOrders = async () => {

          const token = localStorage.getItem("token");

          try {
            console.log(token)
            const response = await fetch(`${API_URL}/orders`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // ✅ This is where ${token} goes
                  },
            });
            if (response.status === 401) {
                setError("Unauthorized: Please log in.");
                return;
              }
        
            if (response.status === 403) {
                setError("Forbidden: You do not have access to this resource.");
                return;
              }
        
            if (!response.ok) {
                throw new Error("Something went wrong.");
              }
            const data = await response.json();
            console.log("Fetched data:", data); 
            setOrders(data)
          } catch (error) {
            console.error("Error fetching orders")
            setError(error.message)
          }
        }
        fetchOrders();
    }, [])


    return (
        <div className="orderHistory">
            <h2>Your Orders</h2>

            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : orders.length === 0 ? (
                <p>No orders</p>
            ) : (
            <ul>
              {orders.map((item) => (
                <li key={item.id}>
                  <strong>Date:</strong> {new Date(item.order_date).toLocaleDateString()} <br />
                  <strong>Status:</strong> {item.status} <br />
                  <strong>Product:</strong> {item.product || "N/A"} <br />
                  <strong>Shipping Address:</strong> {item.shipping_address || "N/A"} <br />
                  <strong>Total:</strong> {item.total_amount || "N/A"} <br />
                </li>
            ))}
            </ul>
            )}
        </div>
);
};

export default OrderHistory;