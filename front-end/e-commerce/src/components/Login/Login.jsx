import './Login.css';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Login({ setName, name }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate()
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password}),
            });

            const data = await response.json();
            console.log("Response:", data)
            if (!response.ok) throw new Error(data.error || "Login Failed");

            setName(data.user.first_name);
            localStorage.setItem("token", data.token);
            navigate("/");

        } catch (err) {
        setError(err.message)
        }
    }


    return (
        <div className="login-container">
            <h2>Login</h2>
            <div className="form">
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input 
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit">Login</button>
            </form>
            </div>
            <a href="http://localhost:5001/auth/google">
              <button>Login with Google</button>
            </a>
        </div>
    )
};


export default Login;