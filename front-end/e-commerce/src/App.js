import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import ProductPage from './components/ProductPage/ProductPage';
import Cart from './components/Cart/Cart';
import Login from './components/Login/Login';
import { useState, useEffect } from "react";
import Register from './components/Register/Register';
import ProductDetail from './components/ProductDetail/ProductDetail';
import OrderHistory from './components/OrderHistory/OrderHistory';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function App() {

const [name, setName] = useState("");
const [cartItems, setCartItems] = useState([]);

const navigate = useNavigate();

useEffect(() => {
  // Check if there's a token in the URL (after Google login redirect)
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');

  if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      const userName = decodedToken.name || 'Google User';
      console.log(decodedToken)

      // Save token to localStorage
      localStorage.setItem('token', token);
      // Optionally, you can also set the user's name or profile data if needed
      setName(userName);
      console.log(token) // Update based on your backend response
      navigate('/'); // Navigate to home or any other page
  }
}, [navigate, setName]);

useEffect(() => {
  console.log('Updated Name:', name); // This will log the updated name
}, [name]);

useEffect(() => {
  console.log("Updated Name:", name);
}, [name])

useEffect(() => {
  console.log("🛒 Cart Items Updated:", cartItems);
}, [cartItems]);

const handleLogout = () => {
  localStorage.removeItem("token"); // Clear JWT from storage
  setName(""); // Or however you're tracking logged-in user state
  navigate("/login");
};

  return (
    <div>
      <Navbar key={name} name={name} cartItems={cartItems} />
      <Routes>
        <Route path="/" element={ <Home className="home" />}/>
        <Route path="/products/:category" element={ <ProductPage setCartItems={setCartItems} cartItems={cartItems} />} />
        <Route path="/products" element={ <ProductPage setCartItems={setCartItems} cartItems={cartItems} />} />
        <Route path="/cart" element={ <Cart setCartItems={setCartItems} cartItems={cartItems} />}/>
        <Route path="/login" element={ name === "" ? <Login setName={setName} name={name} /> : <div><h2>Aslak</h2> <button onClick={handleLogout}>Logout</button></div>}/>
        <Route path="/register" element={ <Register />}/>
        <Route path="/details/:id" element={<ProductDetail setCartItems={setCartItems} />} />
        <Route path="/orderHistory" element={<OrderHistory />} />
      </Routes>
      </div>
  );
}

export default App;
