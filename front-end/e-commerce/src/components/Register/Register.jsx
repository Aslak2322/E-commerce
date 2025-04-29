import "./Register.css";
import { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function Register() {
    const [formData, setFormData] = useState({
        email:'',
        password: '',
        first_name: '',
        last_name: '',
        address: '',
        registration_date: '',
        phone_number: '',
        date_of_birth: '',
        profile_information: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleSumbit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch( `${API_URL}/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Something went wrong');
            } else {
                setSuccess('Registration successful');
                setFormData({
                    email: '',
                    password: '',
                    first_name: '',
                    last_name: '',
                    address: '',
                    registration_date: '',
                    phone_number: '',
                    date_of_birth: '',
                    profile_information: ''
                });
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again later.');
        }
    };


    return(
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSumbit} className="signup-form">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
                <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
                <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                <input type="tel" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
                <textarea name="profile_information" placeholder="Profile Information" value={formData.profile_information} onChange={handleChange}></textarea>

                <button type="Submit">Register</button>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </form>
        </div>
    );
};


export default Register;