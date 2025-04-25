import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useEffect } from "react";


function Navbar({ name, cartItems }) {

    const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

    useEffect(() => {
        console.log("Updated Name:", name);  // ✅ Logs only when `name` updates
    }, [name]);

    return (
        <div className="navbar">
            <ul>
                <li><NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : 'navbar-link'}>Home</NavLink></li>
                <li><NavLink to="/products/" className={({ isActive }) => isActive ? 'active-link' : 'navbar-link'}>Products</NavLink></li>
                <li><NavLink to="/cart" className={({ isActive }) => isActive ? 'active-link' : 'navbar-link'}>Cart {cartCount > 0 && `(${cartCount})`}</NavLink></li>
                <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active-link' : 'navbar-link'}>{name || "Login"}</NavLink> </li>
                <li><NavLink to="/register" className={({ isActive }) => isActive ? 'active-link' : 'navbar-link'}>Sign Up</NavLink></li>
                <li><NavLink to="/orderHistory" className={({ isActive }) => isActive ? 'active-link' : 'navbar-link'}>OrderHistory</NavLink></li>
            </ul>
        </div>
    )
}

export default Navbar;