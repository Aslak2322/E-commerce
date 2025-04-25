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

function App() {

const [name, setName] = useState("");
const [cartItems, setCartItems] = useState([]);



useEffect(() => {
  console.log("Updated Name:", name);
}, [name])

useEffect(() => {
  console.log("🛒 Cart Items Updated:", cartItems);
}, [cartItems]);

  return (
    <Router>
      <Navbar key={name} name={name} cartItems={cartItems} />
      <Routes>
        <Route path="/" element={ <Home className="home" />}/>
        <Route path="/products/:category" element={ <ProductPage setCartItems={setCartItems} cartItems={cartItems} />} />
        <Route path="/products" element={ <ProductPage setCartItems={setCartItems} cartItems={cartItems} />} />
        <Route path="/cart" element={ <Cart setCartItems={setCartItems} cartItems={cartItems} />}/>
        <Route path="/login" element={ name === "" ? <Login setName={setName} /> : <h2>Aslak</h2>}/>
        <Route path="/register" element={ <Register />}/>
        <Route path="/details/:id" element={<ProductDetail setCartItems={setCartItems} />} />
        <Route path="/orderHistory" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
