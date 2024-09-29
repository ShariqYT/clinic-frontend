import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("receptionist");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/users", { email, password, role });
            toast.success("Signup successful");
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
            <h2 className="text-lg font-bold text-center mb-4">Signup</h2>
            <form onSubmit={handleSignup}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="role">Role</label>
                    <select
                        id="role"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="receptionist">Receptionist</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>
                <p className="my-8">
                    Already have an account? <Link to="/" className="text-blue-500">Login</Link>
                </p>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Signup
                </button>
            </form>
        </div>
    );
};

export default Signup;